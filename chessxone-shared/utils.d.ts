import { Board, Color, Column, Piece, Row } from './types';
export declare const inverseColor: (color: Color) => Color;
export declare const toNotation: (piece: Piece, row: Row, column: Column) => string;
export declare const getPieceNotation: (piece: Piece) => "" | "B" | "E" | "N" | "K" | "P" | "Q" | "R";
export declare const parsePieceNotation: (pieceNotation: string) => Piece;
export declare const parseNotation: (notation: string) => {
    row: number;
    column: number;
    piece: Piece;
};
export declare const switchTurn: (turn: Color) => Color;
export declare const isInboundaries: ({ row, column }: {
    row: number;
    column: number;
}) => boolean;
export declare const getPiece: (board: Board, { row, column }: {
    row: number;
    column: number;
}, addRow?: number, addColumn?: number) => {
    row: Row;
    column: Column;
    piece: Piece | undefined;
    player: Color | undefined;
} | null;
export declare const getPawnPromotion: (board: Board, player: Color) => false | {
    row: number;
    column: number;
};
