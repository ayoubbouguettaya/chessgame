import { membersSocket } from '../../../utils/socket-io-instance';
import {
    SETUP_BOARD,
    GAME_END,
    OPPONENT_PAWN_PROMOTION,
    OPPONENT_CASTLING_KING,
    OPPONENT_MOVE_PIECE,
    GAME_NOT_AVAILABLE,
} from '../../../store/game/actions';

const gameStart = (dispatch) => {
    membersSocket.on("game_start", ({
        gameID,
        blackUserName,
        whiteUserName,
        playerColor,
        turn,
        hosterWin = '0',
        guestWin = '0' }) => {
        dispatch({
            type: SETUP_BOARD, payload: {
                gameID,
                blackUserName,
                whiteUserName,
                playerColor,
                turn,
                hosterWin,
                guestWin
            }
        })
    })
}

const gameNotAvailable = (dispatch) => {
    membersSocket.on("game_not_available", () => {
        dispatch({ type: GAME_NOT_AVAILABLE })
    })
}

const gameEnd = (dispatch) => {
    membersSocket.on("game_end", ({ endedBy, winner }) => {
        dispatch({ type: GAME_END, payload: { endedBy, winner } })
    })
}

const move = (dispatch) => {
    membersSocket.on("move", ({ from, to }) => {
        dispatch({ type: OPPONENT_MOVE_PIECE, payload: { from, to } })
    })
}

const pawnPromotion = (dispatch) => {
    membersSocket.on("pawn_promotion", ({ piece }) => {
        dispatch({ type: OPPONENT_PAWN_PROMOTION, payload: { piece } });
    })
}

const castleKing = (dispatch) => {
    membersSocket.on("castle_king", ({ side }) => {
        dispatch({ type: OPPONENT_CASTLING_KING, payload: { side } })
    })
}


const initialiseAllEventListner = (dispatch) => {
    gameStart(dispatch)
    gameEnd(dispatch)
    move(dispatch)
    pawnPromotion(dispatch)
    castleKing(dispatch)
    gameNotAvailable(dispatch)
}

export default initialiseAllEventListner;
