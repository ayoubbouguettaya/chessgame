const UserSocketController = require('../../sockets/controllers/user')
const GameSocketController = require('../../sockets/controllers/game');

const UserStat = require("../models/stats")
const eventEmitter = require("../../sockets/eventEmitter");

exports.getUserGameRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userGameRequestSet = await UserSocketController.getUserGameRequest(userID)

        if (!userGameRequestSet) {
            return res.sendStatus(404);
        }

        return res.status(200).send(userGameRequestSet)
    } catch (error) {
        return next(error);
    }
}

exports.getUserGameInvitation = async (req, res, next) => {
    try {

        const { userID } = req.params;

        const userGameInvitationSet = await UserSocketController.getUserGamesInvitations(userID);
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

        if (!await UserSocketController.isAllowedToRequestGame(userID, opponentID)) {
            return res.sendStatus(403)
        }

        const playerToNotifyGameCancled = await UserSocketController.requestGame(userID, opponentID)

        if (playerToNotifyGameCancled) {
            await eventEmitter.notifyallUserRequestGameCancled(playerToNotifyGameCancled, userID)
        }

        eventEmitter.emitNewGameInvitation(opponentID, userID)

        return res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
}

exports.acceptGame = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: opponentID } = req.body;
        if (!await UserSocketController.isAllowedToApproveGame(userID, opponentID)) {
            return res.sendStatus(403)
        }

        const playerToNotifyGameCancled = await UserSocketController.prepareCreateGame(userID, opponentID)

        if (playerToNotifyGameCancled) {
            await eventEmitter.notifyallUserRequestGameCancled(playerToNotifyGameCancled, userID)
        }

        const gameInfo = await GameSocketController.createGame(opponentID, userID)
        await UserStat.findOneAndUpdate({ userID }, { $inc: { gamesCount: 1 } }, { upsert: true })
        await UserStat.findOneAndUpdate({ userID: opponentID }, { $inc: { gamesCount: 1 } }, { upsert: true })

        await UserSocketController.joinGame(userID, gameInfo)
        await UserSocketController.joinGame(opponentID, gameInfo)
        await eventEmitter.emitNewGame(userID, gameInfo)
        await eventEmitter.emitNewGame(opponentID, gameInfo)

        return res.sendStatus(200);
    } catch (error) {
        console.log('joingame_error', error)
        return next(error)
    }
}