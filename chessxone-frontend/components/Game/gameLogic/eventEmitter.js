import { membersSocket } from '../../../utils/socket-io-instance';
import { toNotation } from './utils';

const handleJoinGame = (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit("join_game", { gameID })
}

const handleAskRematch= (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit("ask_rematch", { gameID })
}

const handleAcceptRematch= (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit("accept_rematch", { gameID })
}

const handleEmitResign = (gameID) => {
    membersSocket.emit("resign", { gameID});
}

const handleClaimTimeOut = (gameID) => {
    membersSocket.emit("time_out", { gameID });
}

const handleClaimCheckMate = (gameID) => {
    membersSocket.emit("check_mate", { gameID });
}

const handleClaimStealMate = (gameID) => {
    membersSocket.emit("steal_mate", { gameID });
}

const handleOfferDraw= (gameID) => {
    membersSocket.emit("offer_draw", { gameID });
}

const move = (gameID, selectedSquare, targetedSquare) => {
    const from = toNotation(selectedSquare.piece, selectedSquare.row, selectedSquare.column);
    const to = toNotation(targetedSquare.piece, targetedSquare.row, targetedSquare.column);
    membersSocket.emit("move", { from, to, gameID });
};

const handlePawnPromotion = (gameID, piece) => {
    membersSocket.emit("pawn_promotion", { gameID, piece })
}

const handleCastleKing = (gameID, side) => {
    membersSocket.emit("castle_king", { gameID, side })
}

const leaveGame = async (gameID) => {
    if (!gameID) {
        return
    }
    console.log(gameID)
    await membersSocket.emit("leave_game", { gameID })
}

export {
    handleJoinGame,
    move,
    handleClaimTimeOut,
    handlePawnPromotion,
    handleCastleKing,
    handleEmitResign,
    leaveGame,
    handleClaimCheckMate,
    handleClaimStealMate,
    handleOfferDraw,
    handleAskRematch,
    handleAcceptRematch
}
