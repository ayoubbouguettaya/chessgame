const io = require("../../config/socketIO-instance");

/* push a notification to the target user By new connection request*/
exports.newConnectionRequest = async (userID, connectionRequestInfo) => {
    try {
        await io.to(userID).emit("add_new_connection_request", connectionRequestInfo);

        return;
    } catch (error) {
        return error;
    }
}

exports.newConnection = async (userID, connection) => {
    try {
        const { userName, tagID, picture } = connection;
        await io.to(userID).emit("add_new_friend", { userName, tagID, picture });

        return;
    } catch (error) {
        return error;
    }
}

exports.updateConnectionStatus = async(userID,connection) => {
    try {
        await io.to(userID).emit("friend_changed_status", connection);

        return;
    } catch (error) {
        return error;
    }
}

exports.gameRequestDeclined = async (hosterID, guestID) => {
    try {
        await io.to(hosterID).emit("request_game_declined", { guestID });
    } catch (error) {
        return error;
    }
}

exports.newGameInvitation = async (userID, opponentID) => {
    try {
        await io.to(userID).emit("add_new_user_game_invitation", { _id: opponentID });
        return;
    } catch (error) {
        return error;
    }
}

exports.requestGameCancled = async (friendID, userID) => {
    try {
        await io.to(friendID).emit("request_game_cancled", { _id: userID });

        return;
    } catch (error) {
        return error;
    }
}

exports.newGame = async (userID, gameInfo) => {
    try {
        await io.to(userID).emit("new_game_ready", gameInfo);
        return;
    } catch (error) {
        return error;
    }
}