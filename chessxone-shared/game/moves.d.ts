import { Board, CastlingSide, Color, Column, Piece, Row, Square } from '../types';
export declare const calculateAllowedSquares: (board: Board, playerColor: Color, row: Row, column: Column, piece: Piece | null) => Square[];
export declare const movePiece: (board: Board, fromSquare: Square, toSquare: Square) => Square[][];
export declare const isAllowedMove: (allowedSquares: Array<Square>, { row, column }: Square) => boolean;
export declare const getCastlePossibility: (board: Board, playerColor: Color) => string[];
export declare const castleKing: (board: Board, playerColor: Color, side: CastlingSide) => void;
