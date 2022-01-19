const PAWN = 'PAWN';
const BISHOP = 'BISHOP';
const kNIGHT = 'KNIGHT';
const KING = 'KING';
const QUEEN = 'QUEEN';
const ROOK = 'ROOK';

const EMPTY = 'EMPTY';
const BLACK = 'BLACK';
const WHITE = 'WHITE';

const COLOR = {
    BLACK,
    WHITE
}
const columnNotation = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
const rowNotation = ['8', '7', '6', '5', '4', '3', '2', '1']

const QUEEN_SIDE = 'QUEEN_SIDE';
const KING_SIDE = 'KING_SIDE';
const BOTH_SIDE = 'BOTH_SIDE'

const gameStatus = {
    loading: 'LOADING',
    running: 'RUNNING',
    ended: 'ENDED'
}

const endedBy = {
    DRAW : 'DRAW',
    RESIGN: 'RESIGN',
    CHECK_MATE: 'CHECK_MATE',
    STEAL_MATE: 'STEAL_MATE',
    TIME_OUT: 'TIME_OUT',
    LEAVE_OUT: 'LEAVE_OUT' 
}

module.exports = {
    PAWN,
    BISHOP,
    kNIGHT,
    KING,
    QUEEN,
    ROOK,
    EMPTY,
    BLACK,
    WHITE,
    columnNotation,
    rowNotation,
    QUEEN_SIDE,
    KING_SIDE,
    BOTH_SIDE,
    gameStatus,
    endedBy,
    COLOR
}