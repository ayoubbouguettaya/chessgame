const io = require('../config/socketIO-instance');

const userController = require('./controllers/user');
const gameController = require('./controllers/game');
const eventEmitter = require('./eventEmitter');

const { COLOR, endedBy, gameStatus } = require('../utils/constants');
const { JOIN_GAME_EVENT, ASK_REMATCH_EVENT, ACCEPT_REMATCH_EVENT, MOVE_EVENT, CASTLE_KING_EVENT, PAWN_PROMOTION_EVENT, RESIGN_EVENT, TIME_OUT_EVENT, CHECK_MATE_EVENT, STEAL_MATE_EVENT, OFFER_DRAW_EVENT, LEAVE_GAME_EVENT } = require('chessxone-shared/events');

const onConnexion = async (socket) => {
    try {
        await socket.join(socket.userID);

        socket.userData = await userController.connect(socket.userID)
        const connectedFriends = await userController.getOnlineConnections(socket.userID);

        await eventEmitter.nofityAllconnectedFriends(connectedFriends, socket.userData);
        await eventEmitter.emitSession(socket.userID);

        return;
    } catch (error) {
        return error;
    }
}

const onDisconnect = async (socket) => {
    socket.on("disconnect", async () => {
        try {
            const socketsInUserIDRoom = await io.in(socket.userID).allSockets();
            if (socketsInUserIDRoom.size === 0) {
                await userController.disconnect(socket.userID)

                const connectedFriends = await userController.getOnlineConnections(socket.userID)

                await eventEmitter.nofityAllconnectedFriends(connectedFriends, { _id: socket.userID, isConnected: false });

                const currentGameID = socket.userData.gameID || '';

                if (currentGameID) {
                    await handleGameEnd(socket, { gameID: currentGameID, endedBy: endedBy.TIME_OUT })
                }
            }
        } catch (error) {
            console.log(error)
        }
    });
}
/* Game Events*/
const onJoinGame = (socket) => {
    socket.on(JOIN_GAME_EVENT, async ({ gameID }) => {
        const userID = socket.userID;
        const gameStored = await gameController.getGame(gameID)
        if (!gameStored) {
            eventEmitter.emitGameNotAvailable(socket.userID)
            return;
        }
        const { turn, whitePlayerID, blackPlayerID, status } = gameStored;
        if (status !== gameStatus.loading) {
            eventEmitter.emitGameNotAvailable(blackPlayerID)
            eventEmitter.emitGameNotAvailable(whitePlayerID)
            return;
        }
        const { userName: blackUserName } = await userController.get(blackPlayerID)
        const { userName: whiteUserName } = await userController.get(whitePlayerID)
        const playerColor = (userID === blackPlayerID) ? COLOR.BLACK : COLOR.WHITE;

        const gameInfo = { gameID, blackUserName, whiteUserName, playerColor, turn };
        await eventEmitter.emitGameStart(userID, gameInfo);
    });
}

const onAskRematch = (socket) => {
    socket.on(ASK_REMATCH_EVENT, async ({ gameID }) => {
        const userID = socket.userID;
        const gameStored = await gameController.getGame(gameID)
        if (!gameStored) {
            eventEmitter.emitGameNotAvailable(userID)
            return;
        }
        const opponentID = await gameController.getOpponentID(gameID, userID);
        await gameController.setPlayerAskingRematch(gameID, userID)

        return await eventEmitter.emitAskRematch(opponentID)
    })
}

const onAcceptRematch = (socket) => {
    socket.on(ACCEPT_REMATCH_EVENT, async ({ gameID }) => {
        const userID = socket.userID;
        const gameStored = await gameController.getGame(gameID)
        if (!gameStored) {
            eventEmitter.emitGameNotAvailable(userID)
            return;
        }
        const playerAskingRematch = await gameController.getPlayerAskingRematch(gameID)
        if (!playerAskingRematch || playerAskingRematch === userID) {
            return;
        }

        await gameController.clearPlayerAskingRematch(gameID)

        const newGame = await gameController.rematchGame(gameID)
        const { guestID, hosterID, blackPlayerID, whitePlayerID, turn, hosterWin = '0', guestWin = '0' } = newGame;
        await userController.joinGame(guestID)
        await userController.joinGame(hosterID)

        const { userName: blackUserName } = await userController.get(blackPlayerID)
        const { userName: whiteUserName } = await userController.get(whitePlayerID)

        await eventEmitter.emitGameStart(blackPlayerID, { gameID, blackUserName, turn, whiteUserName, playerColor: COLOR.BLACK, hosterWin, guestWin });
        await eventEmitter.emitGameStart(whitePlayerID, { gameID, blackUserName, turn, whiteUserName, playerColor: COLOR.WHITE, hosterWin, guestWin });

        return;
    })
}

const onMove = (socket) => {
    socket.on(MOVE_EVENT, async ({ from, to, gameID }) => {
        const opponentID = await gameController.getOpponentID(gameID, socket.userID);

        const isPlayerTurn = await gameController.isPlayerTurn(gameID, socket.userID)
        if (!isPlayerTurn) {
            return null;
        }

        await gameController.makeMove(gameID, { from, to });
        await eventEmitter.emitMove(opponentID, { from, to })
    })
}

const onCastleKing = (socket) => {
    socket.on(CASTLE_KING_EVENT, async ({ gameID, side }) => {
        const opponentID = await gameController.getOpponentID(gameID, socket.userID)
        /*get game info and check turn */
        const isPlayerTurn = await gameController.isPlayerTurn(gameID, socket.userID)
        if (!isPlayerTurn) {
            return null;
        }

        await gameController.makeCastleMove(gameID, side)
        await eventEmitter.emitCastleMove(opponentID, side)
    })
}

const onPawnPromotion = (socket) => {
    socket.on(PAWN_PROMOTION_EVENT, async ({ gameID, piece }) => {
        const opponentID = await gameController.getOpponentID(gameID, socket.userID)
        await gameController.promotePawn(gameID, piece)
        await eventEmitter.emitPawnPromotion(opponentID, piece)
    })
}

/* Ending Games*/
const onClaimResign = (socket) => {
    socket.on(RESIGN_EVENT, async ({ gameID }) => {
        await handleGameEnd(socket, { gameID, endedBy: endedBy.RESIGN }, true)

        return;
    })
}

const onClaimTimeOut = (socket) => {
    socket.on(TIME_OUT_EVENT, async ({ gameID }) => {
        await handleGameEnd(socket, { gameID, endedBy: endedBy.TIME_OUT }, true)
        return;
    })
}

const onClaimCheckMate = (socket) => {
    socket.on(CHECK_MATE_EVENT, async ({ gameID }) => {
        try {
            await handleGameEnd(socket, { gameID, endedBy: endedBy.CHECK_MATE }, true)
            return;
        } catch (error) {
            console.log('error in check mate', error.message)
        }
    })
}

const onClaimStealMate = (socket) => {
    socket.on(STEAL_MATE_EVENT, async ({ gameID }) => {
        await handleGameEnd(socket, { gameID, endedBy: endedBy.STEAL_MATE }, true)
        return;
    })
}

const onOfferDraw = (socket) => {
    socket.on(OFFER_DRAW_EVENT, async ({ gameID }) => {
        // await handleGameEnd(socket,{gameID,endedBy: endedBy.DRAW },true)
        return;
    })
}

const onLeaveGame = (socket) => {
    socket.on(LEAVE_GAME_EVENT, async ({ gameID = '' }) => {
        await handleGameEnd(socket, { gameID, endedBy: endedBy.LEAVE_OUT }, true)
        return;
    })
}

const handleGameEnd = async (socket, { gameID, endedBy: endedByParams }, withNotify = false) => {
    const theGame = await gameController.getGame(gameID);
    if (!theGame) {
        return;
    }

    const { whitePlayerID, blackPlayerID, status } = theGame;
    if (status === gameStatus.ended) {
        return;
    }

    let winner = socket.userID === whitePlayerID ? COLOR.BLACK : COLOR.WHITE;

    if (endedByParams === endedBy.STEAL_MATE || endedByParams === endedBy.DRAW) {
        winner = ''
    }
    await gameController.endGame(gameID, { winner, endedBy: endedByParams })
    await userController.leaveGame(whitePlayerID);
    await userController.leaveGame(blackPlayerID);

    await eventEmitter.emitGameEnd(whitePlayerID, { endedBy: endedByParams, winner })
    await eventEmitter.emitGameEnd(blackPlayerID, { endedBy: endedByParams, winner })

    if (withNotify) {
        const blackInfo = await userController.get(blackPlayerID)
        const whiteInfo = await userController.get(whitePlayerID);

        const BlackconnectedFriends = await userController.getOnlineConnections(blackPlayerID)
        const whiteconnectedFriends = await userController.getOnlineConnections(whitePlayerID)

        await eventEmitter.nofityAllconnectedFriends(BlackconnectedFriends, blackInfo);
        await eventEmitter.nofityAllconnectedFriends(whiteconnectedFriends, whiteInfo);
    }
}

module.exports = {
    onConnexion,
    onDisconnect,
    onJoinGame,
    onAskRematch,
    onAcceptRematch,
    onMove,
    onCastleKing,
    onPawnPromotion,
    onLeaveGame,
    onClaimResign,
    onClaimTimeOut,
    onClaimCheckMate,
    onClaimStealMate,
    onOfferDraw,
}