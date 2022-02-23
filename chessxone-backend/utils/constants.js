const {
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
} = require("chessxone-shared/constants");

const { GameStatus, EndedBy } = require("chessxone-shared/types");

const COLOR = {
    BLACK, WHITE
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
    gameStatus: GameStatus,
    endedBy: EndedBy,
    COLOR,
}