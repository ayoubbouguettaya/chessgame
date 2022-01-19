const UserSocketController = require('../../sockets/controllers/user')
const GameSocketController = require('../../sockets/controllers/game');

const UserStat = require("../models/stats")
const eventEmitter = require("../../sockets/eventEmitter");

exports.getUserGameRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;


        const userGameRequestSet = await UserSocketController.getUserGameRequest(userID)
        if (!userGameRequestSet) {
            return res.sendStatus(404)
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
        const { userID: friendID } = req.body;

        if (!await UserSocketController.isAllowedToRequestGame(userID, friendID)) {
            return res.sendStatus(403)
        }

        const friendToNotifyGameCancled = await UserSocketController.requestGame(userID, friendID)

        if (friendToNotifyGameCancled) {
            await eventEmitter.notifyallUserRequestGameCancled(friendToNotifyGameCancled, userID)
        }

        eventEmitter.emitNewGameInvitation(friendID, userID)

        return res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
}

exports.acceptGame = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: friendID } = req.body;
        if (!await UserSocketController.isAllowedToApproveGame(userID, friendID)) {
            return res.sendStatus(403)
        }

        const friendToNotifyGameCancled = await UserSocketController.prepareCreateGame(userID, friendID)

        if (friendToNotifyGameCancled) {
            await eventEmitter.notifyallUserRequestGameCancled(friendToNotifyGameCancled, userID)
        }

        const gameInfo = await GameSocketController.createGame(friendID, userID)
        await UserStat.findOneAndUpdate({ userID }, { $inc: { gamesCount: 1 } }, { upsert: true })
        await UserStat.findOneAndUpdate({ userID: friendID }, { $inc: { gamesCount: 1 } }, { upsert: true })

        await UserSocketController.joinGame(userID, gameInfo)
        await UserSocketController.joinGame(friendID, gameInfo)
        await eventEmitter.emitNewGame(userID, gameInfo)
        await eventEmitter.emitNewGame(friendID, gameInfo)

        return res.sendStatus(200);
    } catch (error) {
        console.log('joingame_error', error)
        return next(error)
    }
}