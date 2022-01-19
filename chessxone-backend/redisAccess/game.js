const redisCommand = require('../utils/redisCommand');

const { generateNewObjectID, generate_gameID_Key } = require('../utils/')

const set = async (hosterID, guestID,addInfo = {}) => {
    try {
        const gameID = (await generateNewObjectID()).toString();
    
        const data = { hosterID, guestID,gameID ,...addInfo}
        await redisCommand.hmSet(generate_gameID_Key(gameID), data,{min: 50})
        return data;
    } catch (error) {
        return (error)
    }
}

const edit = async (gameID, data= {}) => {
    try {
        await redisCommand.hmSet(generate_gameID_Key(gameID), data)
        return data;
    } catch (error) {
        return (error)
    }
}

const get = async (gameID) => {
    try {
        return await redisCommand.hGetAll(generate_gameID_Key(gameID))
    } catch (error) {
        return error
    }
}

module.exports = {
    set,
    get,
    edit,
}