import {
    BLACK,
    WHITE,
    PAWN,
    BISHOP,
    kNIGHT,
    KING,
    QUEEN,
    ROOK,
    EMPTY,
} from './constants';

import { toNotation, inverseColor } from './utils';

export const setupBoard = () => {
    let bgColor = BLACK;
    let piece;
    let player = undefined;
    let board = [];
    for (let row = 0; row < 8; row++) {
        let currentRow = [];
        for (let column = 0; column < 8; column++) {
            piece = EMPTY;
            if (row === 1 || row === 6) {
                piece = PAWN;
            }

            if (row === 0 || row === 7) {
                if (column === 0 || column === 7) {
                    piece = ROOK;
                }
                if (column === 1 || column === 6) {
                    piece = kNIGHT;
                }
                if (column === 2 || column === 5) {
                    piece = BISHOP;
                }
                if (column === 3) {
                    piece = QUEEN;
                }
                if (column === 4) {
                    piece = KING;
                }
            }
            if (row === 0 || row === 1) {
                player = BLACK;
            }

            if (row === 6 || row === 7) {
                player = WHITE;
            }
            if (column !== 0) {
                bgColor = inverseColor(bgColor);
            }
            const square = {
                bgColor,
                row,
                column,
                piece,
                notation: toNotation(piece,row, column),
                player,
            }
            currentRow.push(square)
        }
        board.push(currentRow);
    }

    return board;
}

