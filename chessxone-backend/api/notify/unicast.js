const { NEW_CONNECTION_REQUEST_EVENT,
    CONNECTION_UPDATE_EVENT,
    NEW_CONNECTION_EVENT,
    NEW_INCOMING_MATCH_REQUEST_EVENT,
    OUTGOING_MATCH_REQUEST_DECLINED_EVENT,
    NEW_GAME_READY_EVENT
} = require("chessxone-shared/events");
const io = require("../../config/socketIO-instance");

/* push a notification to the target user By new connection request*/
exports.newConnectionRequest = async (userID, connectionRequestInfo) => {
    try {
        await io.to(userID).emit(NEW_CONNECTION_REQUEST_EVENT, connectionRequestInfo);

        return;
    } catch (error) {
        return error;
    }
}

exports.newConnection = async (userID, connection) => {
    try {
        const { userName, tagID, picture } = connection;
        await io.to(userID).emit(NEW_CONNECTION_EVENT, { userName, tagID, picture });

        return;
    } catch (error) {
        return error;
    }
}

exports.updateConnectionStatus = async (userID, connection) => {
    try {
        await io.to(userID).emit(CONNECTION_UPDATE_EVENT, connection);

        return;
    } catch (error) {
        return error;
    }
}

exports.outGoingMatchRequestDeclined = async (hosterID, guestID) => {
    try {
        await io.to(hosterID).emit(OUTGOING_MATCH_REQUEST_DECLINED_EVENT, { guestID });
    } catch (error) {
        return error;
    }
}

exports.newIncomingMatchRequest = async (userID, opponentID) => {
    try {
        await io.to(userID).emit(NEW_INCOMING_MATCH_REQUEST_EVENT, { _id: opponentID });
        return;
    } catch (error) {
        return error;
    }
}

exports.newGame = async (userID, gameInfo) => {
    try {
        await io.to(userID).emit(NEW_GAME_READY_EVENT, gameInfo);
        return;
    } catch (error) {
        return error;
    }
}