import { membersSocket } from '../../../utils/socket-io-instance';
import {
    SETUP_BOARD,
    GAME_END,
    OPPONENT_PAWN_PROMOTION,
    OPPONENT_CASTLING_KING,
    OPPONENT_MOVE_PIECE,
    GAME_NOT_AVAILABLE,
} from '../../../store/game/actions';
import { CASTLE_KING_EVENT, GAME_END_EVENT, GAME_START_EVENT, MOVE_EVENT, PAWN_PROMOTION_EVENT } from 'chessxone-shared/events';

const gameStart = (dispatch) => {
    membersSocket.on(GAME_START_EVENT, ({
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
    membersSocket.on(GAME_NOT_AVAILABLE, () => {
        dispatch({ type: GAME_NOT_AVAILABLE })
    })
}

const gameEnd = (dispatch) => {
    membersSocket.on(GAME_END_EVENT, ({ endedBy, winner }) => {
        dispatch({ type: GAME_END, payload: { endedBy, winner } })
    })
}

const move = (dispatch) => {
    membersSocket.on(MOVE_EVENT, ({ from, to }) => {
        dispatch({ type: OPPONENT_MOVE_PIECE, payload: { from, to } })
    })
}

const pawnPromotion = (dispatch) => {
    membersSocket.on(PAWN_PROMOTION_EVENT, ({ piece }) => {
        dispatch({ type: OPPONENT_PAWN_PROMOTION, payload: { piece } });
    })
}

const castleKing = (dispatch) => {
    membersSocket.on(CASTLE_KING_EVENT, ({ side }) => {
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
