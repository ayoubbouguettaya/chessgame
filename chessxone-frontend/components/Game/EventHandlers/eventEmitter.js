import { membersSocket } from '../../../utils/socket-io-instance';
import { toNotation } from 'chessxone-shared/utils';
import {
    JOIN_GAME_EVENT,
    ASK_REMATCH_EVENT,
    ACCEPT_REMATCH_EVENT,
    RESIGN_EVENT,
    TIME_OUT_EVENT,
    CHECK_MATE_EVENT,
    STEAL_MATE_EVENT,
    OFFER_DRAW_EVENT,
    MOVE_EVENT,
    PAWN_PROMOTION_EVENT,
    CASTLE_KING_EVENT,
    LEAVE_GAME_EVENT
} from 'chessxone-shared/events'

const handleJoinGame = (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit(JOIN_GAME_EVENT, { gameID })
}

const handleAskRematch = (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit(ASK_REMATCH_EVENT, { gameID })
}

const handleAcceptRematch = (gameID) => {
    if (!gameID) {
        return
    }
    membersSocket.emit(ACCEPT_REMATCH_EVENT, { gameID })
}

const handleEmitResign = (gameID) => {
    membersSocket.emit(RESIGN_EVENT, { gameID });
}

const handleClaimTimeOut = (gameID) => {
    membersSocket.emit(TIME_OUT_EVENT, { gameID });
}

const handleClaimCheckMate = (gameID) => {
    membersSocket.emit(CHECK_MATE_EVENT, { gameID });
}

const handleClaimStealMate = (gameID) => {
    membersSocket.emit(STEAL_MATE_EVENT, { gameID });
}

const handleOfferDraw = (gameID) => {
    membersSocket.emit(OFFER_DRAW_EVENT, { gameID });
}

const move = (gameID, selectedSquare, targetedSquare) => {
    const from = toNotation(selectedSquare.piece, selectedSquare.row, selectedSquare.column);
    const to = toNotation(targetedSquare.piece, targetedSquare.row, targetedSquare.column);
    membersSocket.emit(MOVE_EVENT, { from, to, gameID });
};

const handlePawnPromotion = (gameID, piece) => {
    membersSocket.emit(PAWN_PROMOTION_EVENT, { gameID, piece })
}

const handleCastleKing = (gameID, side) => {
    membersSocket.emit(CASTLE_KING_EVENT, { gameID, side })
}

const leaveGame = async (gameID) => {
    if (!gameID) {
        return
    }
    console.log(gameID)
    await membersSocket.emit(LEAVE_GAME_EVENT, { gameID })
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
