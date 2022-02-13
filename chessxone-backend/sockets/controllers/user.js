const User = require('../../api/models/user');
const UserOnHotAccess = require('../../hotAccess/user');

const redisCommand = require('../../utils/redisCommand');
const { LAST_CONNECTED_USERS } = require('../../utils/redisKeys');

const connect = async (userID) => {
    try {

        const userInfo = await User.findById(userID, 'userName tagID picture').lean();
        const lastTimeConnected = new Date();
        const dataToStore = {
            ...userInfo,
            _id: userID,
            isConnected: true,
            isLocked: false,
            isPlaying: false,
            lastTimeConnected
        };

        await UserOnHotAccess.set(userID, dataToStore)
        await redisCommand.sadd(LAST_CONNECTED_USERS, socket.userID)

        return dataToStore;
    } catch (error) {
        return error;
    }

}

const disconnect = async (userID) => {
    try {
        await redisCommand.srem(LAST_CONNECTED_USERS, socket.userID)
        return await UserOnHotAccess.setIsConnected(userID, false)
    } catch (error) {
        return error;
    }
}

const get = async (userID) => {
    try {
        const userInfoInCache = await UserOnHotAccess.get(userID)

        if (!userInfoInCache) {
            return await User.findById(userID, 'userName tagID picture').lean();
        }

        return userInfoInCache;
    } catch (error) {
        return error
    }
}

const getOnlineConnections = async (userID) => {
    try {
        const user = await User.findById(userID, 'connections').lean();

        if (!user) {

            return []
        }
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

        return onlineConnections
    } catch (error) {
        return error;
    }
}

const joinGame = async (userID, gameInfo) => {
    try {
        await UserOnHotAccess.setGame(userID, gameInfo);
        await UserOnHotAccess.setIsLocked(true)
        await UserOnHotAccess.setIsPlaying(true)
    } catch (error) {
        return error;
    }
}

const leaveGame = async (userID) => {
    try {
        await UserOnHotAccess.setIsLocked(userID, false);
        await UserOnHotAccess.setIsPlaying(userID, false);
        return await UserOnHotAccess.removeGameID(userID)
    } catch (error) {
        return error;
    }
}

module.exports = {
    connect,
    disconnect,
    getOnlineConnections,
    get,
    joinGame,
    leaveGame
}