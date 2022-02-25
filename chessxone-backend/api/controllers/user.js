const User = require('../models/user');
const UserOnHotAccess = require('../../hotAccess/user');

const { notify } = require("../notify");

const redisCommand = require('../../utils/redisCommand');
const { generateNewTagID } = require('../../utils');
const { LAST_CONNECTED_USERS } = require('../../utils/redisKeys');

exports.getCurrent = async (req, res, next) => {
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

exports.getOne = async (req, res, next) => {
    try {
        const { userID } = req.params;

        const userInfoInCache = await UserOnHotAccess.get(userID)

        if (!userInfoInCache) {
            const user = await User.findById(userID, 'userName tagID _id picture').lean();

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

        const userFound = await User.findOne({ tagID }, 'userName bio picture _id').lean();
        if (!userFound) {
            return res.sendStatus(404)
        }

        return res.status(200).send(userFound)
    } catch (error) {
        return next(error)
    }
}

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
        await notify.newConnectionRequest(friendID, { _id, userName, tagID, picture })

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

        await notify.newConnection(userID, friend)
        await notify.newConnection(friendID, user)

        return res.sendStatus(200);
    } catch (error) {
        return next(error)
    }
}

exports.getAllConnectionRequests = async (req, res, next) => {
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

exports.getOnlineConnections = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const user = await User.findById(userID, 'connections').lean();

        const { connections } = user;
        const onlineConnections = [];

        for (let connectionID of connections) {
            const connection = await UserOnHotAccess.get(connectionID.toString())
            if (connection && connection.isConnected) {
                onlineConnections.push({
                    _id: connection._id,
                    userName: connection.userName,
                    tagID: connection.tagID,
                    picture: connection.picture,
                    isConnected: connection.isConnected,
                    isLocked: connection.isLocked,
                    isPlaying: connection.isPlaying,
                })
            }
        }

        return res.status(200).send(onlineConnections);
    } catch (error) {
        return next(error)
    }
}

exports.getFeed = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const lastConnectedUsers = await redisCommand.srandmember(LAST_CONNECTED_USERS, 20)
        
        res.send(lastConnectedUsers)
        return;
    } catch (error) {
        return next(error)
    }
}