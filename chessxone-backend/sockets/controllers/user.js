const User = require('../../api/models/user');
const UserOnRedis = require('../../redisAccess/user');

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

        await UserOnRedis.set(userID, dataToStore)
        await redisCommand.sadd(LAST_CONNECTED_USERS, socket.userID)

        return dataToStore;
    } catch (error) {
        return error;
    }

}

const disconnect = async (userID) => {
    try {
        await redisCommand.srem(LAST_CONNECTED_USERS, socket.userID)
        return await UserOnRedis.setIsConnected(userID, false)
    } catch (error) {
        return error;
    }
}

const get = async (userID) => {
    try {
        const userInfoInCache = await UserOnRedis.get(userID)

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
            const connection = await UserOnRedis.get(connectionID.toString())
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
        await UserOnRedis.setGame(userID, gameInfo);
        await UserOnRedis.setIsLocked(true)
        await UserOnRedis.setIsPlaying(true)
    } catch (error) {
        return error;
    }
}

const leaveGame = async (userID) => {
    try {
        await UserOnRedis.setIsLocked(userID, false);
        await UserOnRedis.setIsPlaying(userID, false);
        return await UserOnRedis.removeGameID(userID)
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