const redisCommand = require('../utils/redisCommand');
const {
    generate_IncomingMatchRequests_Key,
} = require('../utils');

const get = async (userID) => {
    try {
        return await redisCommand.smembers(generate_IncomingMatchRequests_Key(userID));
    } catch (error) {
        return error
    }
}

const clear = async (userID) => {
    try {
        await redisCommand.del(generate_IncomingMatchRequests_Key(userID))
    } catch (error) {
return error;        
    }
}
 
const push = async (guestID,hosterID) => {
    try {
     await redisCommand.sadd(generate_IncomingMatchRequests_Key(guestID), hosterID )
    } catch (error) {
        return error
    }
}

const pull = async (guestID,hosterID) => {
    try {
        await redisCommand.srem(generate_IncomingMatchRequests_Key(guestID), hosterID)
    } catch (error) {
        return error;
    }
}

module.exports = {
    get,
    clear,
    push,
    pull,
}