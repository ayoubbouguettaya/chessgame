const UserStat = require("../models/stats")
const UserGameRequestOnRedis = require("../../redisAccess/userGameRequest");
const UserGamesInvitationsOnRedis = require("../../redisAccess/userGamesInvitation");
const UserOnRedis = require('../../redisAccess/user');
const GameOnRedis = require('../../redisAccess/game')

const { notify, notifyAll } = require("../notify");

const { gameStatus, COLOR } = require("../../utils/constants");

exports.getUserGameRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userGameRequestSet = await UserGameRequestOnRedis.get(userID);

        if (!userGameRequestSet) {
            return res.sendStatus(404);
        }
        const { issued_at } = userGameRequestSet;
        const issuedAtInMillSeconds = new Date(issued_at).getTime();
        const cuurentTimeInMillSeconds = new Date().getTime();

        userGameRequestSet.issuedXXSecondsAgo = Math.floor((cuurentTimeInMillSeconds - issuedAtInMillSeconds) / 1000);
        return res.status(200).send(userGameRequestSet)
    } catch (error) {
        return next(error);
    }
}

exports.getUserGameInvitation = async (req, res, next) => {
    try {

        const { userID } = req.params;

        const userGameInvitationSet = await UserGamesInvitationsOnRedis.get(userID);

        if (!userGameInvitationSet) {
            return res.sendStatus(404)
        }

        return res.status(200).send(userGameInvitationSet)
    } catch (error) {
        return next(error);
    }
}

exports.requestGame = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: opponentID } = req.body;

        if (!await isAllowedToRequestGame(userID, opponentID)) {
            return res.sendStatus(403)
        }

        await UserGameRequestOnRedis.set(userID, opponentID)

        await UserGamesInvitationsOnRedis.push(opponentID, userID)
        await UserOnRedis.setIsLocked(userID, true);

        const playerToNotifyGameCancled = await UserGamesInvitationsOnRedis.get(userID)

        if (playerToNotifyGameCancled) {
            UserGamesInvitationsOnRedis.clear(userID)

            for (let playerToNotify of playerToNotifyGameCancled) {
                await UserGameRequestOnRedis.clear(playerToNotify)
            }

            await notifyAll.requestGameCancled(playerToNotifyGameCancled, userID)
        }

        await notify.newGameInvitation(opponentID, userID);

        return res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
}

exports.acceptGame = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: opponentID } = req.body;
        /* checking Legebility*/
        if (!await isAllowedToApproveGame(userID, opponentID)) {
            console.log("\n is not allowed tro appreove rhe game \n")
            return res.sendStatus(403)
        }
        /* Preparing to create the Game*/
        await UserGameRequestOnRedis.clear(opponentID)
        await UserOnRedis.setIsLocked(userID, true);

        const playerToNotifyGameCancled = await UserGamesInvitationsOnRedis.get(userID)

        if (playerToNotifyGameCancled) {
            UserGamesInvitationsOnRedis.clear(userID)

            for (let playerToNotify of playerToNotifyGameCancled) {
                await UserGameRequestOnRedis.clear(playerToNotify)
            }

            await notifyAll.requestGameCancled(playerToNotifyGameCancled, userID)
        }
        /* Create the game*/
        /* -----------------------Create a game and Notify---------------------------------------------*/
        const gameInfo = await createGame(opponentID, userID)

        await notify.newGame(userID, gameInfo);
        await notify.newGame(opponentID, gameInfo);

        /* Statistics*/
        await UserStat.findOneAndUpdate({ userID }, { $inc: { gamesCount: 1 } }, { upsert: true })
        await UserStat.findOneAndUpdate({ userID: opponentID }, { $inc: { gamesCount: 1 } }, { upsert: true })
        /* -------------------------------------------------------------------*/

        return res.sendStatus(200);
    } catch (error) {
        console.log('joingame_error', error)
        return next(error)
    }
}

exports.declineGame = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: opponentID } = req.body;

        await UserGameRequestOnRedis.clear(opponentID)
        await UserGamesInvitationsOnRedis.pull(userID, opponentID)

        await notify.gameRequestDeclined(opponentID, userID)

        return res.sendStatus(200);

    } catch (error) {
        return next(error)
    }
}

/*-----------------------------------HELPERS ------------------------------------------*/
const isAllowedToRequestGame = async (hosterID, guestID) => {
    try {
        if (hosterID === guestID) {
            return false;
        }
        const userGameInvitationSet = await UserGamesInvitationsOnRedis.get(hosterID)
        const guestUserGameInvitationSet = await UserGamesInvitationsOnRedis.get(guestID)

        if (guestUserGameInvitationSet.includes(hosterID)) {
            return false
        }

        if (userGameInvitationSet.includes(guestID)) {
            return false
        }

        const userGameRequestInfo = await UserGameRequestOnRedis.get(hosterID);
        if (userGameRequestInfo) {
            return false;
        }

        return true;
    } catch (error) {
        return error;
    }
}

const isAllowedToApproveGame = async (guestID, hosterID) => {
    try {
        const userGameRequestInfo = await UserGameRequestOnRedis.get(hosterID)
        if (!userGameRequestInfo) {
            await UserGamesInvitationsOnRedis.pull(guestID, hosterID)
            return false;
        }

        if (userGameRequestInfo.opponentID !== guestID) {
            return false;
        }

        const guestGameInvitationsSet = await UserGamesInvitationsOnRedis.get(guestID)
        if (!guestGameInvitationsSet.includes(hosterID)) {
            return false;
        }

        return true;
    } catch (error) {
        return error;
    }
}

const createGame = async (hosterID, guestID) => {
    try {
        const turn = COLOR.WHITE;
        const whitePlayerID = hosterID;
        const blackPlayerID = guestID;
        const status = gameStatus.loading;
        const gameInfo =  await GameOnRedis.set(hosterID, guestID, {
            turn, whitePlayerID, blackPlayerID, status, hosterWin: '0', guestWin: '0', count: '1'
        });
        await UserOnRedis.setGame(hosterID, gameInfo);
        await UserOnRedis.setGame(guestID, gameInfo);

        await UserOnRedis.setIsLocked(hosterID,true)
        await UserOnRedis.setIsLocked(guestID,true);

        await UserOnRedis.setIsPlaying(hosterID,true);
        await UserOnRedis.setIsPlaying(guestID,true);

        return gameInfo;
    } catch (error) {
        return error;
    }
}

