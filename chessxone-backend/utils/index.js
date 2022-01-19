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

const generate_UserGameInvitation_Key = (userID) => (`USER_GAMES_INVITATION_${userID}`);
const generate_UserGameRequest_Key = (userID) => (`USER_GAME_REQUEST${userID}`);
const generate_userID_Key = (userID) => (`USER_ID_${userID}`);
const generate_gameID_Key = (gameID) => (`GAME_ID_${gameID}`);

module.exports = {
    generateNewTagID,
    generateNewObjectID,
    generate_UserGameInvitation_Key,
    generate_UserGameRequest_Key,
    generate_userID_Key,
    generate_gameID_Key,
}