const GameOnHotAccess = require('../../hotAccess/game');
const { COLOR, KING_SIDE, gameStatus } = require('../../utils/constants');

const switchTurn = (turn) => (turn === COLOR.BLACK ? COLOR.WHITE : COLOR.BLACK);

const rematchGame = async (gameID) => {
    try {
        const theGame = await GameOnHotAccess.get(gameID)

        const { whitePlayerID,
            blackPlayerID,
            hosterID,
            guestID,
            winner = '',
            endedBy = '',
            hosterWin = '0',
            guestWin = '0',
            count
        } = theGame;

        let newHosterWin = hosterWin;
        let newGuestWin = guestWin;

        const theHosterIsOnWhite = whitePlayerID === hosterID;

        if(winner === COLOR.WHITE){
            if(guestID === whitePlayerID){
                newGuestWin = Number.parseInt(guestWin) +1
            }else{
                newHosterWin = Number.parseInt(hosterWin) + 1
            }
        }

        if(winner === COLOR.BLACK){
            if(guestID === blackPlayerID){
                newGuestWin = Number.parseInt(guestWin) +1;
            }else{
                newHosterWin = Number.parseInt(hosterWin) + 1
            }
        }
          
        const newGameInfo = {
            turn: COLOR.WHITE,
            status: gameStatus.running,
            whitePlayerID: theHosterIsOnWhite ? guestID : hosterID,
            blackPlayerID: theHosterIsOnWhite ? hosterID : guestID,
            winner: '',
            endedBy: '',
            moves: '',
            hosterWin:  newHosterWin,
            guestWin:  newGuestWin,
            count: Number.parseInt(count) + 1
        }

        await GameOnHotAccess.edit(gameID,newGameInfo);
        return newGameInfo; 
    } catch (error) {
        return error;
    }
}

const getGame = async (gameID) => {
    try {
        return await GameOnHotAccess.get(gameID)
    } catch (error) {
        return error;
    }
}

const getOpponentID = async (gameID, userID) => {
    const { hosterID, guestID } = await GameOnHotAccess.get(gameID);
    if (userID === hosterID) {
        return guestID
    }
    if (userID === guestID) {
        return hosterID
    }
    return false;
}

const isPlayerTurn = async (gameID, userID) => {
    const { blackPlayerID, whitePlayerID, turn } = await GameOnHotAccess.get(gameID);
    /*black turn and the player is black or is the white turn and the player is the white p */
    if ((turn === COLOR.BLACK && userID === blackPlayerID) || (turn === COLOR.WHITE && userID === whitePlayerID)) {
        return true;
    }
    return false;
}

const makeMove = async (gameID, { from, to }) => {
    const theGame = await GameOnHotAccess.get(gameID);
    const { turn, moves = ' ' } = theGame;
    const newTurn = switchTurn(turn);
    const newMoves = `${moves} | ${from}-${to}`;

    await GameOnHotAccess.edit(gameID, { turn: newTurn, moves: newMoves ,status: gameStatus.running})
    return true;
}

const makeCastleMove = async (gameID, side) => {
    const theGame = await GameOnHotAccess.get(gameID);
    const { turn, moves } = theGame;
    const newTurn = switchTurn(turn);
    const newMoves = `${moves} | ${side === KING_SIDE ? '0-0-0' : '0-0'}`;

    await GameOnHotAccess.edit(gameID, { turn: newTurn, moves: newMoves })
    return true;
}

const promotePawn = async (gameID, piece) => {
    const theGame = await GameOnHotAccess.get(gameID);
    const { moves } = theGame;

    const newMoves = `${moves}=${piece}`;

    await GameOnHotAccess.edit(gameID, { moves: newMoves })
    return true;
}

const endGame = async (gameID, info) => {
    await GameOnHotAccess.edit(gameID, { ...info, status: gameStatus.ended })
    return true;
}

const setPlayerAskingRematch = async (gameID, userID) => {
    await GameOnHotAccess.edit(gameID, { playerAskingRequest: userID })
    return true;
}

const getPlayerAskingRematch = async (gameID) => {
    const theGame = await GameOnHotAccess.get(gameID);
    if (!theGame || !theGame.playerAskingRequest) {
        return null;
    }
    return theGame.playerAskingRequest;
}

const clearPlayerAskingRematch = async (gameID) => {
    const theGame = await GameOnHotAccess.get(gameID);
    if (!theGame || !theGame.playerAskingRequest) {
        return null;
    }
    return await GameOnHotAccess.edit(gameID, { playerAskingRequest: '' })
}

module.exports = {
    rematchGame,
    getGame,
    getOpponentID,
    isPlayerTurn,
    makeMove,
    makeCastleMove,
    promotePawn,
    endGame,
    setPlayerAskingRematch,
    getPlayerAskingRematch,
    clearPlayerAskingRematch
}