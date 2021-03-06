const redisCommand = require('../utils/redisCommand');

const generate_userID_Key = (userID) => (`USER_ID_${userID}`);

const set = async (userID, data) => {
    try {
        await redisCommand.hmSet(generate_userID_Key(userID), data, { days: 1 })
    } catch (error) {
        return (error)
    }
}

const get = async (userID) => {
    try {
        return await redisCommand.hGetAll(generate_userID_Key(userID))
    } catch (error) {
        return (error)
    }
}

const setIsLocked = async (userID, isLocked) => {
    try {
        await redisCommand.hmSet(generate_userID_Key(userID), { isLocked })
    } catch (error) {
        return (error)
    }
}

const setIsPlaying = async (userID, isLocked) => {
    try {
        await redisCommand.hmSet(generate_userID_Key(userID), { isPlaying })
    } catch (error) {
        return (error)
    }
}

const setIsConnected = async (userID, isConnected) => {
    try {
        await redisCommand.hmSet(generate_userID_Key(userID), { isConnected, lastTimeConnected: new Date() })
    } catch (error) {
        return (error)
    }
}

const setGame = async (userID, gameInfo) => {
    try {
        const { gameID } = gameInfo;
        await redisCommand.hmSet(generate_userID_Key(userID), { gameID })
    } catch (error) {
        return (error)
    }
}

const removeGameID = async (userID) => {
    try {
        await redisCommand.hDel(generate_userID_Key(userID), 'gameID')
    } catch (error) {
        return (error)
    }
}

module.exports = {
    set,
    get,
    setIsLocked,
    setIsPlaying,
    setIsConnected,
    setGame,
    removeGameID
}