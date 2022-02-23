import { Color, Piece } from '../types';
export declare const setupBoard: () => {
    bgColor: Color;
    row: number;
    column: number;
    piece: Piece;
    notation: string;
    player: Color | undefined;
}[][];
