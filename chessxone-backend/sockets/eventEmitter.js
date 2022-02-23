const io = require('../config/socketIO-instance');

const { CONNECTION_UPDATE_EVENT,
    SESSION_EVENT,
    MOVE_EVENT,
    GAME_START_EVENT,
    ASK_REMATCH_EVENT,
    GAME_NOT_AVAILABLE_EVENT,
    CASTLE_KING_EVENT,
    PAWN_PROMOTION_EVENT,
    GAME_END_EVENT,
} = require('chessxone-shared/events')
/*  notify All connected Friends */
const nofityAllconnectedFriends = async (connectedFriends, userData, event = CONNECTION_UPDATE_EVENT) => {
    try {
        for (let i = 0; i < connectedFriends.length; i++) {
            const friendID = connectedFriends[i]._id.toString();
            if (event = CONNECTION_UPDATE_EVENT) {
                await io.to(friendID).emit(CONNECTION_UPDATE_EVENT, userData);
            }
        }

        return;
    } catch (error) {
        return error;
    }
}

const emitSession = async (userID) => {
    try {
        await io.to(userID).emit(SESSION_EVENT, {});
        return;
    } catch (error) {
        return error;
    }
}
// Game Emitters 
const emitGameStart = async (userID, gameInfo) => {
    try {
        await io.to(userID).emit(GAME_START_EVENT, gameInfo);
        return;
    } catch (error) {
        return error;
    }
}

const emitAskRematch = async (userID) => {
    try {
        await io.to(userID).emit(ASK_REMATCH_EVENT);
        return;
    } catch (error) {
        return error;
    }
}

const emitGameNotAvailable = async (userID) => {
    try {
        await io.to(userID).emit(GAME_NOT_AVAILABLE_EVENT);
        return;
    } catch (error) {
        return error;
    }
}

const emitMove = async (userID, move) => {
    try {
        await io.to(userID).emit(MOVE_EVENT, move);
        return;
    } catch (error) {
        return error;
    }
}

const emitCastleMove = async (userID, side) => {
    try {
        await io.to(userID).emit(CASTLE_KING_EVENT, { side });
        return;
    } catch (error) {
        return error;
    }
}

const emitPawnPromotion = async (userID, piece) => {
    try {
        await io.to(userID).emit(PAWN_PROMOTION_EVENT, { piece })
    } catch (error) {
        return error;
    }
}

const emitGameEnd = async (userID, { winner, endedBy }) => {
    try {
        await io.to(userID).emit(GAME_END_EVENT, { endedBy, winner })
    } catch (error) {
        return error;
    }
}

module.exports = {
    nofityAllconnectedFriends,
    emitSession,

    emitAskRematch,
    emitGameStart,
    emitGameNotAvailable,
    emitMove,
    emitCastleMove,
    emitPawnPromotion,
    emitGameEnd,
}