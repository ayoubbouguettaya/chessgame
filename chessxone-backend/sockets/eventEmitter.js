const io = require('../config/socketIO-instance');

/*  notify All connected Friends */
const nofityAllconnectedFriends = async (connectedFriends, userData, event = 'friend_changed_status') => {
    try {
        for (let i = 0; i < connectedFriends.length; i++) {
            const friendID = connectedFriends[i]._id.toString();
            if (event = 'friend_changed_status') {
                        await io.to(friendID).emit("friend_changed_status", userData);
            }
        }

        return;
    } catch (error) {
        return error;
    }
}

const emitSession = async (userID) => {
    try {
        await io.to(userID).emit("session", {  });
        return;
    } catch (error) {
        return error;
    }
}
// Game Emitters 
const emitGameStart = async (userID, gameInfo) => {
    try {
        await io.to(userID).emit("game_start", gameInfo);
        return;
    } catch (error) {
        return error;
    }
}

const emitAskRematch = async (userID) => {
    try {
        await io.to(userID).emit("ask_rematch");
        return;
    } catch (error) {
        return error;
    }
}

const emitGameNotAvailable = async (userID) => {
    try {
        await io.to(userID).emit("game_not_available");
        return;
    } catch (error) {
        return error;
    }
}

const emitMove = async (userID, move) => {
    try {
        await io.to(userID).emit('move', move);
        return;
    } catch (error) {
        return error;
    }
}

const emitCastleMove = async (userID, side) => {
    try {
        await io.to(userID).emit("castle_king", { side });
        return;
    } catch (error) {
        return error;
    }
}

const emitPawnPromotion = async (userID, piece) => {
    try {
        await io.to(userID).emit("pawn_promotion", { piece })
    } catch (error) {
        return error;
    }
}

const emitGameEnd = async (userID, { winner, endedBy }) => {
    try {
        await io.to(userID).emit("game_end", { endedBy, winner })
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