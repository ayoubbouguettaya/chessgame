const redisInstance = require('../config/redisDBInstance');

const hmSet = async (redisKey, data, expireIn = { min: 0, days: 0 }) => {
    try {
        const keyValueFormattedArray = [];
        const { min = 0, days = 0 } = expireIn;

        Object.entries(data).forEach(([key, value]) => { keyValueFormattedArray.push(key, value || '') });
        await redisInstance.hmset(redisKey, ...keyValueFormattedArray)

        const expireInSec = 60 * 60 * 24 * Number.parseInt(days) +
            60 * Number.parseInt(min);

        if (expireInSec !== 0) {
            await redisInstance.expire(redisKey, expireInSec)
        }

        return data;
    } catch (error) {
        return error;
    }
}

const hGetAll = async (redisKey) => {
    try {
        return await redisInstance.hgetall(redisKey)
    } catch (error) {
        return error;
    }
}

const hDel = async (redisKey,attri) =>{
    try {
        return await redisInstance.hdel(redisKey,attri)
    } catch (error) {
        return error;
    } 
}

const get = async (redisKey) => {
    try {
        return await redisInstance.get(redisKey)
    } catch (error) {
        return error
    }
}

const set = async (redisKey, value) => {
    try {
        return await redisInstance.set(redisKey, value)
    } catch (error) {
        return error
    }
}

const del = async (redisKey) => {
    try {
        await redisInstance.del(redisKey);
        return true;
    } catch (error) {
        return error
    }
}

const incr = async (redisKey) => {
    try {
        await redisInstance.incr(redisKey);
        return true;
    } catch (error) {
        return error;
    }
}


const sadd = async (redisKey, value, expireIn = { min: 0, days: 0 }) => {
    try {
        await redisInstance.sadd(redisKey, value)
        const { min = 0, days = 0 } = expireIn;
        const expireInSec = 60 * 60 * 24 * Number.parseInt(days) +
        60 * Number.parseInt(min);

    if (expireInSec !== 0) {
        await redisInstance.expire(redisKey, expireInSec)
    }
        return;

    } catch (error) {
        return error
    }
}

const spop = async (redisKey, value) => {
    try {
        return await redisInstance.spop(redisKey, value)
    } catch (error) {
        return error
    }
}
const srandmember = async (redisKey, value) => {
    try {
        return await redisInstance.SRANDMEMBER(redisKey, value)
    } catch (error) {
        return error
    }
}


const srem = async (redisKey, value) => {
    try {
        return await redisInstance.srem(redisKey, value)
    } catch (error) {
        return error
    }
}
const smembers = async (redisKey) => {
    try {
        return await redisInstance.smembers(redisKey)
    } catch (error) {
        return error
    }
}

module.exports = {
    hmSet,
    hGetAll,
    hDel,
    get,
    set,
    del,
    incr,
    sadd,
    spop,
    srandmember,
    srem,
    smembers
}