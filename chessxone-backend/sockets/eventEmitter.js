const io = require('../config/socketIO-instance');

/*  General Events */

const nofityAllconnectedFriends = async (connectedFriends, userData, event = 'friend_changed_status') => {
    try {
        for (let i = 0; i < connectedFriends.length; i++) {
            const friendID = connectedFriends[i]._id.toString();
            if (event = 'friend_changed_status') {
                await emitFriendChangedStatus(friendID, userData)
            }
        }

        return;
    } catch (error) {
        return error;
    }
}

const notifyallUserRequestGameCancled = async (friendsRequestGame, userID) => {
    try {
        for (let i = 0; i < friendsRequestGame.length; i++) {
            const friendID = friendsRequestGame[i]._id;
            await emitRequestGameCancled(friendID, userID)
        }

        return;
    } catch (error) {
        return error;
    }
}

const emitSession = async (userID, connectedFriends,gameID) => {
    try {
        await io.to(userID).emit("session", { connectedFriends,gameID });
        return;
    } catch (error) {
        return error;
    }
}

const emitFriendChangedStatus = async (friendID, userData) => {
    try {
        await io.to(friendID).emit("friend_changed_status", userData);
        return;
    } catch (error) {
        return error;
    }
}

const emitNewFriend = async (userID, friendInfo) => {
    try {
        /* Approve */
        await io.to(userID).emit("add_new_friend", friendInfo);
        
        return;
    } catch (error) {
        return error;
    }
}

const emitNewConnectionRequest = async (userID, connectionRequestInfo) => {
    try {
        await io.to(userID).emit("add_new_connection_request", connectionRequestInfo);

        return;
    } catch (error) {
        return error;
    }
}

const emitNewGameInvitation = async (userID, opponentID) => {
    try {
        await io.to(userID).emit("add_new_user_game_invitation", { _id: opponentID });
        return;
    } catch (error) {
        return error;
    }
}

const emitNewGame = async (userID,gameInfo) => {
    try {
        await io.to(userID).emit("new_game_ready",gameInfo);
        return;
    } catch (error) {
        return error;
    }
}

const emitRequestGameCancled = async (friendID, userID) => {
    try {
        await io.to(friendID).emit("request_game_cancled", { _id: userID });

        return;
    } catch (error) {
        return error;
    }
}

// Game Emitters 
const emitGameStart = async (userID,gameInfo) => {
    try {
        await io.to(userID).emit("game_start",gameInfo);
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

const emitMove = async (userID,move) => {
    try {
        await io.to(userID).emit('move',move);
        return;
    } catch (error) {
        return error;
    }
}

const emitCastleMove = async (userID, side) => {
    try {
        await io.to(userID).emit("castle_king",{side});
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
    emitFriendChangedStatus,
    emitNewFriend,
    emitNewConnectionRequest,
    notifyallUserRequestGameCancled,
    emitNewGameInvitation,
    emitNewGame,

    emitAskRematch,
    emitGameStart,
    emitGameNotAvailable,
    emitMove,
    emitCastleMove,
    emitPawnPromotion,
    emitGameEnd,
}