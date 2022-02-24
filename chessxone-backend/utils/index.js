const mongoose = require('mongoose');
const redis = require('./redisCommand');
const User = require('../api/models/user')

const { TAG_ID_OFFSET } = require("./redisKeys");

const randomCaracters = (length = 3) => {
    const caracters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = ''
    for (let i = 0; i < length; i++) {
        randomString += caracters.charAt(Math.floor(Math.random() * caracters.length));
    }
    return randomString;
}

const findUserBytagID = (tagIdParams) => User.findOne({ tagID: tagIdParams }).lean()

const generateNewTagID = async (customFindByTagID = null) => {
    let isFound = false;
    do {
        const tagIDOffset = await redis.get(TAG_ID_OFFSET) || 1;
        if (Number.parseInt(tagIDOffset) === 8999) {
            await redis.set(TAG_ID_OFFSET, 1)
        } else {
            await redis.incr(TAG_ID_OFFSET)
        }

        const randomSide = randomCaracters(3)
        const offsetSide = Number.parseInt(tagIDOffset) + 1000;

        tagID = randomSide + offsetSide;
/*
is a case of testing we will need this custom_Find_By_tag_ID function
*/
        isFound = customFindByTagID ? await customFindByTagID(tagID) : await findUserBytagID(tagID)

    } while (isFound);

    return tagID
};

const generateNewObjectID = async () => { return await new mongoose.Types.ObjectId(); }

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