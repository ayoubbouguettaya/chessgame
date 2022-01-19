export const PAWN = 'PAWN';
export const BISHOP = 'BISHOP';
export const kNIGHT = 'KNIGHT';
export const KING = 'KING';
export const QUEEN = 'QUEEN';
export const ROOK = 'ROOK';

export const EMPTY = 'EMPTY';
export const BLACK = 'BLACK';
export const WHITE = 'WHITE';
export const columnNotation = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const rowNotation = ['8', '7', '6', '5', '4', '3', '2', '1']

export const QUEEN_SIDE = 'QUEEN_SIDE';
export const KING_SIDE = 'KING_SIDE';
export const BOTH_SIDE = 'BOTH_SIDE'

export const castlingSide = {
    QUEEN_SIDE, KING_SIDE, BOTH_SIDE
}

export const endedBy = {
    DRAW : 'DRAW',
    RESIGN: 'RESIGN',
    CHECK_MATE: 'CHECK_MATE',
    STEAL_MATE: 'STEAL_MATE',
    TIME_OUT: 'TIME_OUT' ,
    LEAVE_OUT: 'LEAVE_OUT' 
}

export const gameStatus = {
    loading: 'LOADING',
    running: 'RUNNING',
    ended: 'ENDED',
    not_available: 'NOT_AVAILABLE'
}

export const timerType = {
    _10minPerPlayer: '10MIN_PER_PLAYER',
    _5minPerPlayer: '5MIN_PER_PLAYER',
    _1minPerTurn: '1MIN_PER_TURN',
}