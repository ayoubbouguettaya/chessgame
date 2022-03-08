const {outGoingMatchRequestDeclined} = require("./unicast");

exports.outGoingMatchRequestDeclined = async (usersSet, userID) => {
    /* 
    when user request a game and he is already requested by some players (Hosters)
    we react by notify them that outgoingMatch_request is declined so they will be able 
    to request another player that will be interested 
    */
    try {
        for (let connection of usersSet){
            await outGoingMatchRequestDeclined(connection._id.toString(),userID);
        }

        return;
    } catch (error) {
        return error;
    }
}