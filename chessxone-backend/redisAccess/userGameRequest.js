const redisCommand = require('../utils/redisCommand');
const {
    generate_UserGameRequest_Key,
} = require('../utils');

const get = async (userID) => {
    try {
        return await redisCommand.hGetAll(generate_UserGameRequest_Key(userID))
    } catch (error) {
        return error
    }
}

const set = async (hosterID, guestID) => {
    try {
        await redisCommand.hmSet(
            generate_UserGameRequest_Key(hosterID),
            { opponentID: guestID, issued_at: new Date() },
            { min: 10 });

        return;
    } catch (error) {
        return error;
    }
}

const clear = async (userID) => {
    try {
        return await redisCommand.del(generate_UserGameRequest_Key(userID))
    } catch (error) {
        return error
    }
}

module.exports = {
    set,
    get,
    clear,
}
