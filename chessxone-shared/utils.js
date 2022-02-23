"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPawnPromotion = exports.getPiece = exports.isInboundaries = exports.switchTurn = exports.parseNotation = exports.parsePieceNotation = exports.getPieceNotation = exports.toNotation = exports.inverseColor = void 0;
const constants_1 = require("./constants");
const inverseColor = (color) => (color === constants_1.BLACK ? constants_1.WHITE : constants_1.BLACK);
exports.inverseColor = inverseColor;
const toNotation = (piece, row, column) => (`${(0, exports.getPieceNotation)(piece)}${constants_1.columnNotation[column]}${constants_1.rowNotation[row]}`);
exports.toNotation = toNotation;
const getPieceNotation = (piece) => {
    switch (piece) {
        case constants_1.kNIGHT:
            return 'N';
        case constants_1.KING:
            return 'K';
        case constants_1.BISHOP:
            return 'B';
        case constants_1.PAWN:
            return "P";
        case constants_1.QUEEN:
            return 'Q';
        case constants_1.ROOK:
            return 'R';
        case constants_1.EMPTY:
            return 'E';
        default:
            return '';
    }
};
exports.getPieceNotation = getPieceNotation;
const parsePieceNotation = (pieceNotation) => {
    switch (pieceNotation) {
        case 'N':
            return constants_1.kNIGHT;
        case 'K':
            return constants_1.KING;
        case 'B':
            return constants_1.BISHOP;
        case "P":
            return constants_1.PAWN;
        case 'Q':
            return constants_1.QUEEN;
        case 'R':
            return constants_1.ROOK;
        case 'E':
            return constants_1.EMPTY;
        default:
            return constants_1.EMPTY;
    }
};
exports.parsePieceNotation = parsePieceNotation;
const parseNotation = (notation) => {
    const piece = (0, exports.parsePieceNotation)(notation.charAt(0));
    const column = constants_1.columnNotation.indexOf(notation.charAt(1));
    const row = constants_1.rowNotation.indexOf(notation.charAt(2));
    return { row, column, piece };
};
exports.parseNotation = parseNotation;
const switchTurn = (turn) => {
    if (turn === constants_1.BLACK) {
        return constants_1.WHITE;
    }
    return constants_1.BLACK;
};
exports.switchTurn = switchTurn;
const isInboundaries = ({ row, column }) => {
    if (row >= 0 && row < 8 && column >= 0 && column < 8) {
        return true;
    }
    return false;
};
exports.isInboundaries = isInboundaries;
const getPiece = (board, { row, column }, addRow = 0, addColumn = 0) => {
    if ((0, exports.isInboundaries)({ row: row + addRow, column: column + addColumn })) {
        const nextSquare = board[row + addRow][column + addColumn];
        return {
            row: nextSquare.row,
            column: nextSquare.column,
            piece: nextSquare.piece,
            player: nextSquare.player
        };
    }
    return null;
};
exports.getPiece = getPiece;
const getPawnPromotion = (board, player) => {
    const lastRow = player === constants_1.BLACK ? 7 : 0;
    for (let column = 0; column < 8; column++) {
        if (board[lastRow][column].piece === constants_1.PAWN) {
            return { row: lastRow, column };
        }
    }
    return false;
};
exports.getPawnPromotion = getPawnPromotion;
