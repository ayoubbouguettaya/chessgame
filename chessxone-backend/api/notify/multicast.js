const io = require("../../config/socketIO-instance");
const {notify} = require("../notify");

exports.requestGameCancled = async (usersSet, userID) => {
    try {
        for (let connection of usersSet){
            await notify.requestGameCancled(connection._id.toString(),userID);
        }

        return;
    } catch (error) {
        return error;
    }
}