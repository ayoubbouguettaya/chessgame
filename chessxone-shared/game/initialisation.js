"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupBoard = void 0;
const constants_1 = require("../constants");
const utils_1 = require("../utils");
const setupBoard = () => {
    /*
    TODO : bgColor ? is it right to save in the global state of Board
    */
    let bgColor = constants_1.BLACK;
    let piece;
    let player = undefined;
    let board = [];
    for (let row = 0; row < 8; row++) {
        let currentRow = [];
        for (let column = 0; column < 8; column++) {
            piece = constants_1.EMPTY;
            if (row === 1 || row === 6) {
                piece = constants_1.PAWN;
            }
            if (row === 0 || row === 7) {
                if (column === 0 || column === 7) {
                    piece = constants_1.ROOK;
                }
                if (column === 1 || column === 6) {
                    piece = constants_1.kNIGHT;
                }
                if (column === 2 || column === 5) {
                    piece = constants_1.BISHOP;
                }
                if (column === 3) {
                    piece = constants_1.QUEEN;
                }
                if (column === 4) {
                    piece = constants_1.KING;
                }
            }
            if (row === 0 || row === 1) {
                player = constants_1.BLACK;
            }
            if (row === 6 || row === 7) {
                player = constants_1.WHITE;
            }
            if (column !== 0) {
                bgColor = (0, utils_1.inverseColor)(bgColor);
            }
            const square = {
                bgColor,
                row,
                column,
                piece,
                notation: (0, utils_1.toNotation)(piece, row, column),
                player,
            };
            currentRow.push(square);
        }
        board.push(currentRow);
    }
    return board;
};
exports.setupBoard = setupBoard;
