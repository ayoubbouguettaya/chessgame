import { CastlingSide, Color, Piece } from "./types";

export const PAWN : Piece = 'PAWN';
export const BISHOP : Piece = 'BISHOP';
export const kNIGHT : Piece = 'KNIGHT';
export const KING : Piece = 'KING';
export const QUEEN : Piece = 'QUEEN';
export const ROOK : Piece = 'ROOK';
export const EMPTY : Piece = 'EMPTY';

export const BLACK: Color = 'BLACK';
export const WHITE: Color = 'WHITE';

export const columnNotation = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
export const rowNotation = ['8', '7', '6', '5', '4', '3', '2', '1']

export const QUEEN_SIDE : CastlingSide = 'QUEEN_SIDE';
export const KING_SIDE : CastlingSide = 'KING_SIDE';
export const BOTH_SIDE : CastlingSide = 'BOTH_SIDE'
