const User = require('../models/user');
const Game = require('../models/game')
const { generateNewTagID } = require('../../utils');

const userSocketController = require('../../sockets/controllers/user')
const gameSocketController = require('../../sockets/controllers/game')

const eventEmitter = require('../../sockets/eventEmitter');
const redisCommand = require('../../utils/redisCommand');

const UserOnRedis = require('../../redisAccess/user')

exports.getOne = async (req, res, next) => {
    try {
        const { userPayload: { uid: firebaseId } } = req;
        const user = await User.findOne({ firebaseId });
        if (user) {
            res.status(200).send(user);
            return;
        }
        res.sendStatus(404);
        return;
    } catch (error) {
        return res.sendStatus(500);
    }
};

exports.add = async (req, res, next) => {
    try {
        const { uid: firebaseId, email, picture, firebase: { sign_in_provider: provider } } = req.userPayload;
        const userPayload = req.body;

        const { usePicture } = userPayload;

        const user = await User.findOne({ firebaseId });
        if (user) {
            return res.status(403).send("user Already existe")
        }
        const tagID = await generateNewTagID();
        console.log(tagID)
        const newUser = await User.create({
            ...userPayload,
            email,
            firebaseId,
            picture: (usePicture && picture) ? picture : '/avatars/default.webp',
            provider,
            tagID,
        });

        res.status(200).send(newUser);
    } catch (error) {
        return next(error)
    }
};

exports.edit = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const userPayload = req.body;

        const editedUser = await User.findByIdAndUpdate(userID, userPayload, { new: true, useFindAndModify: false });

        if (!editedUser) {
            res.sendStatus(404);
            return;
        }
        res.status(200).send(editedUser);
        return;
    } catch (error) {
        next(error)
        return
    }
};

exports.addConnectionRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: friendID } = req.body;

        if (userID === friendID) {
            return res.sendStatus(403);
        }

        const user = await User.findById(userID)
        const { connections, incomingRequests, outgoingRequests } = user;

        const friend = await User.findById(friendID)

        if (!friend) {
            return res.sendStatus(404);
        }

        if (connections.includes(friendID)
            || incomingRequests.includes(friendID)
            || outgoingRequests.includes(friendID)) {
            res.sendStatus(403);
            return;
        }

        if (friend.incomingRequests.includes(userID)) {
            return res.sendStatus(300)
        }

        user.outgoingRequests.push(friendID);
        await user.save();

        friend.incomingRequests.push(userID)
        await friend.save();

        /* Notify Friend */

        const { _id, userName, tagID, picture } = user;
        await eventEmitter.emitNewConnectionRequest(friendID, { _id, userName, tagID, picture })

        return res.sendStatus(200);

    } catch (error) {
        next(error)
        return
    }
}

exports.approveConnectionRequest = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userID: friendID } = req.body;

        const user = await User.findById(userID);
        const friend = await User.findById(friendID);

        /* check */
        if (user.connections.includes(friendID)
            || !user.incomingRequests.includes(friendID)
        ) {
            return res.sendStatus(403);
        }

        if (!friend.outgoingRequests.includes(userID)) {
            /* something really bad happend */
            user.incomingRequests.pull(friendID)
            user.save();
            return res.sendStatus(405);
        }

        /* Update Data */

        user.connections.push(friendID);
        user.incomingRequests.pull(friendID)

        friend.connections.push(userID)
        friend.outgoingRequests.pull(userID);

        await user.save();
        await friend.save();

        /* notify both players*/

        const friendInfo = await userSocketController.getData(friendID)
        const userInfo = await userSocketController.getData(userID);

        await eventEmitter.emitNewFriend(userID, friendInfo)
        await eventEmitter.emitNewFriend(friendID, userInfo);

        return res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
}

exports.getAllRequests = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userInfo = await User.findById(userID, 'incomingRequests outgoingRequests')
            .populate('incomingRequests', 'userName picture tagID isConnected')
            .populate('outgoingRequests', 'userName');

        if (!userInfo) {
            return res.sendStatus(404);
        }

        return res.status(200).send(userInfo);
    } catch (error) {
        return next(error);
    }
}

exports.getFriendInfo = async (req, res, next) => {
    try {
        const { userID, friendID } = req.params;

        const user = await User.findById(userID)
        const friend = await User.findById(friendID, 'userName tagID _id picture')

        if (!user || !friend || !user.connections.includes(friendID)) {
            res.sendStatus(404);
            return;
        }

        res.status(200).send(friend);
        return;
    } catch (error) {
        return res.sendStatus(500);
    }
};

exports.getUserInfo = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userInfoInCache = await UserOnRedis.get(userID)

        if (!userInfoInCache) {
            const user = await User.findById(userID, 'userName tagID _id picture')

            if (!user) {
                res.sendStatus(404);
                return;
            }
            res.status(200).send(user);
            return;
        }

        return res.status(200).send(userInfoInCache);
    } catch (error) {
        return res.sendStatus(500);
    }
};

exports.getByTagID = async (req, res, next) => {
    try {

        const { tagID } = req.params;

        const userFound = await User.findOne({ tagID }, 'userName bio picture _id')
        if (!userFound) {
            return res.sendStatus(404)
        }

        return res.status(200).send(userFound)
    } catch (error) {
        return next(error)
    }
}

exports.getOnlineFriend = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const connectionsInfo = await userSocketController.getConnectedFriends(userID)
        return res.status(200).send(connectionsInfo);
    } catch (error) {
        return next(error)
    }
}

exports.saveGame = async (req, res, next) => {
    try {
        const { userID, gameID: gameIDParams } = req.params;
        const gameInfo = await gameSocketController.getGame(gameIDParams)

        if (!gameInfo) {
            return res.sendStatus(403);
        }

        const round = {
            endedBy: gameInfo.endedBy,
            winner: gameInfo.winner,
            whitePlayerID: gameInfo.whitePlayerID,
            blackPlayerID: gameInfo.blackPlayerID,
            moves: gameInfo.moves,
            count: Number.parseInt(gameInfo.count),
        }
        const rounds = [];
        const gameID = gameInfo.gameID;

        const gameStored = await Game.findOne({ gameID })

        if (!gameStored) {
            rounds.push(round)
            const { _id } = await Game.create({ gameID, rounds })
            await User.findByIdAndUpdate(userID, { $push: { savedGames: _id } })
            return res.sendStatus(200);
        }
        if (gameStored.rounds.findIndex((gameround) => (gameround.count === round.count)) === -1) {
            gameStored.rounds.push(round)
            await gameStored.save()
            return res.sendStatus(200)
        }
        res.sendStatus(403)
    } catch (error) {
        console.log('error in saving', error.message)
    }
}

exports.getFeed = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userInfo = await User.findById(userID, 'connections').lean()

        let connections = [];
        if (userInfo) { connections = userInfo.connections; }
        const lastConnectedUsers = await redisCommand.srandmember('LAST_CONNECTED_USERS', 20)
        res.send(lastConnectedUsers)
        return;
    } catch (error) {
        return next(error)
    }
}