export declare type Color = 'BLACK' | 'WHITE';
export declare type Piece = 'KNIGHT' | 'KING' | 'BISHOP' | 'PAWN' | 'QUEEN' | 'ROOK' | 'EMPTY';
export declare type CastlingSide = 'QUEEN_SIDE' | 'KING_SIDE' | 'BOTH_SIDE';
export declare type Square = {
    row: Row;
    column: Column;
    piece?: Piece;
    bgColor?: Color;
    player?: Color;
    notation?: String;
};
export declare type Board = Square[][];
export declare enum EndedBy {
    DRAW = "DRAW",
    RESIGN = "RESIGN",
    CHECK_MATE = "CHECK_MATE",
    STEAL_MATE = "STEAL_MATE",
    TIME_OUT = "TIME_OUT",
    LEAVE_OUT = "LEAVE_OUT"
}
export declare enum GameStatus {
    loading = "LOADING",
    running = "RUNNING",
    ended = "ENDED",
    not_available = "NOT_AVAILABLE"
}
export declare enum TimerType {
    _10minPerPlayer = "10MIN_PER_PLAYER",
    _5minPerPlayer = "5MIN_PER_PLAYER",
    _1minPerTurn = "1MIN_PER_TURN"
}
export declare type Row = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
export declare type Column = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
