const OutGoingMatchReq = require("../../hotAccess/outGoingMatchReq");
const InComingMatchReq = require("../../hotAccess/inComingMatchReq");
const UserOnHotAccess = require('../../hotAccess/user');
const GameOnHotAccess = require('../../hotAccess/game')

const StatsController = require("../stats/controller");
const { notify, notifyAll } = require("../notify");

const { gameStatus, COLOR } = require("../../utils/constants");

exports.getOutGoingRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const outGoingReqHash = await OutGoingMatchReq.get(userID);

        if (!outGoingReqHash) {
            return res.sendStatus(404);
        }
        const { issued_at } = outGoingReqHash;
        const issuedAtInMillSeconds = new Date(issued_at).getTime();
        const cuurentTimeInMillSeconds = new Date().getTime();

        outGoingReqHash.issuedXXSecondsAgo = Math.floor((cuurentTimeInMillSeconds - issuedAtInMillSeconds) / 1000);
        return res.status(200).send(outGoingReqHash)
    } catch (error) {
        return next(error);
    }
}

exports.getInComingRequest = async (req, res, next) => {
    try {

        const { userID } = req.params;

        const inComingRequestSet = await InComingMatchReq.get(userID);

        if (!inComingRequestSet) {
            return res.sendStatus(404)
        }

        return res.status(200).send(inComingRequestSet)
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

        await OutGoingMatchReq.set(userID, opponentID)

        await InComingMatchReq.push(opponentID, userID)
        await UserOnHotAccess.setIsLocked(userID, true);

        const playerToNotifyGameCancled = await InComingMatchReq.get(userID)

        if (playerToNotifyGameCancled) {
            InComingMatchReq.clear(userID)

            for (let playerToNotify of playerToNotifyGameCancled) {
                await OutGoingMatchReq.clear(playerToNotify)
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
            return res.sendStatus(403)
        }
        /* Preparing to create the Game*/
        await OutGoingMatchReq.clear(opponentID)
        await UserOnHotAccess.setIsLocked(userID, true);

        const playerToNotifyGameCancled = await InComingMatchReq.get(userID)

        if (playerToNotifyGameCancled) {
            InComingMatchReq.clear(userID)

            for (let playerToNotify of playerToNotifyGameCancled) {
                await OutGoingMatchReq.clear(playerToNotify)
            }

            await notifyAll.requestGameCancled(playerToNotifyGameCancled, userID)
        }
        /* Create the game*/
        /* -----------------------Create a game and Notify---------------------------------------------*/
        const gameInfo = await createGame(opponentID, userID)

        await notify.newGame(userID, gameInfo);
        await notify.newGame(opponentID, gameInfo);

        /* Statistics*/
        await StatsController.incrementGameCount(userID);
        await StatsController.incrementGameCount(opponentID);
        
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

        await OutGoingMatchReq.clear(opponentID)
        await InComingMatchReq.pull(userID, opponentID)

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
        const hosterIncomingRequestSet = await InComingMatchReq.get(hosterID)
        const guestIncomingRequestSet = await InComingMatchReq.get(guestID)

        if (guestIncomingRequestSet.includes(hosterID)) {
            return false
        }

        if (hosterIncomingRequestSet.includes(guestID)) {
            return false
        }

        const hosterOutGoingReqHash = await OutGoingMatchReq.get(hosterID);
        if (hosterOutGoingReqHash) {
            return false;
        }

        return true;
    } catch (error) {
        return error;
    }
}

const isAllowedToApproveGame = async (guestID, hosterID) => {
    try {
        const hosterOutGoingReqHash = await OutGoingMatchReq.get(hosterID)
        if (!hosterOutGoingReqHash) {
            await InComingMatchReq.pull(guestID, hosterID)
            return false;
        }

        if (hosterOutGoingReqHash.opponentID !== guestID) {
            return false;
        }

        const guestIncomingRequestSet = await InComingMatchReq.get(guestID)
        if (!guestIncomingRequestSet.includes(hosterID)) {
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
        const gameInfo = await GameOnHotAccess.set(hosterID, guestID, {
            turn,
            whitePlayerID,
            blackPlayerID,
            status,
            hosterWin: '0',
            guestWin: '0',
            count: '1'
        });
        await UserOnHotAccess.setGame(hosterID, gameInfo);
        await UserOnHotAccess.setGame(guestID, gameInfo);

        await UserOnHotAccess.setIsLocked(hosterID, true)
        await UserOnHotAccess.setIsLocked(guestID, true);

        await UserOnHotAccess.setIsPlaying(hosterID, true);
        await UserOnHotAccess.setIsPlaying(guestID, true);

        return gameInfo;
    } catch (error) {
        return error;
    }
}

