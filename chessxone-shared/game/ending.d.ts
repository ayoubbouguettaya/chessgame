import { Board, Color, Square } from "../types";
export declare const checkForAnyLegalMove: (board: Board, playerColor: Color) => boolean;
export declare const filterCheckMoves: (allowedSqaures: Square[], { board, playerColor, selectedSquare }: {
    board: Board;
    playerColor: Color;
    selectedSquare: Square;
}) => Square[];
export declare const getKingPosition: (board: Board, playerColor: Color) => {
    row: import("../types").Row;
    column: import("../types").Column;
    piece: import("../types").Piece | undefined;
    player: Color | undefined;
} | null;
export declare const detectedCheck: (board: Board, playerColor: Color, kingSquare?: Square | null) => boolean;
