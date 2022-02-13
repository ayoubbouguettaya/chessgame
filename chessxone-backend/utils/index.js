const mongoose = require('mongoose');
const redis = require('./redisCommand')

const { TAG_ID_OFFSET } = require("./redisKeys");

const generateNewTagID = async () => {
    await redis.incr(TAG_ID_OFFSET)
    const tagIDOffset = await redis.get(TAG_ID_OFFSET);
    console.log(tagIDOffset)
    return (Number.parseInt(tagIDOffset) + 1234567);
};

const generateNewObjectID = async () => {return await new mongoose.Types.ObjectId();}

const generate_IncomingMatchRequests_Key = (userID) => (`INCOMING_MATCH_REQS_${userID}`);
const generate_OutgoingMatchRequest_Key = (userID) => (`OUTGOING_MATCH_REQ_${userID}`);
const generate_userID_Key = (userID) => (`USER_ID_${userID}`);
const generate_gameID_Key = (gameID) => (`GAME_ID_${gameID}`);

module.exports = {
    generateNewTagID,
    generateNewObjectID,
    generate_IncomingMatchRequests_Key,
    generate_OutgoingMatchRequest_Key,
    generate_userID_Key,
    generate_gameID_Key,
}