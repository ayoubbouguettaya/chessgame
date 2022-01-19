import {
    rowNotation,
    columnNotation,
    BLACK,
    WHITE,
    kNIGHT,
    KING,
    BISHOP,
    PAWN,
    QUEEN,
    ROOK,
    EMPTY
} from './constants';

export const inverseColor = (color) => (color === BLACK ? WHITE : BLACK);

export const toNotation = (piece, row, column) => (`${getPieceNotation(piece)}${columnNotation[column]}${rowNotation[row]}`);

const getPieceNotation = (piece) => {
    switch (piece) {
        case kNIGHT:
            return 'N'
        case KING:
            return 'K'
        case BISHOP:
            return 'B'
        case PAWN:
            return "P"
        case QUEEN:
            return 'Q'
        case ROOK:
            return 'R'
        case EMPTY:
            return 'E'
        default:
            return ''
    }
}

const parsePieceNotation = (pieceNotation) => {
    switch (pieceNotation) {
        case 'N':
            return kNIGHT
        case 'K':
            return KING
        case 'B':
            return BISHOP
        case "P":
            return PAWN
        case 'Q':
            return QUEEN
        case 'R':
            return ROOK
        case 'E':
            return EMPTY
        default:
            return '';
    }
}

export const parseNotation = (notation) => {
    const piece = parsePieceNotation(notation.charAt(0))
    const column = columnNotation.indexOf(notation.charAt(1))
    const row = rowNotation.indexOf(notation.charAt(2))
    return { row, column, piece }
};

export const switchTurn = (turn) => {
    if (turn === BLACK) {
        return WHITE;
    }
    return BLACK;
}

export const isInboundaries = ({ row, column }) => {
    if (row >= 0 && row < 8 && column >= 0 && column < 8) {
        return true
    }
    return false
}

export const getPiece = (board, { row, column }, addRow = 0, addColumn = 0) => {
    if (isInboundaries({ row: row + addRow, column: column + addColumn })) {
        const nextSquare = board[row + addRow][column + addColumn];
        return {
            row: nextSquare.row,
            column: nextSquare.column,
            piece: nextSquare.piece,
            player: nextSquare.player
        }
    }
    return null;
}

export const getPawnPromotion = (board, playerColor) => {
    const lastRow = playerColor === BLACK ? 7 : 0;

    for (let column = 0; column < 8; column++) {
        if (board[lastRow][column].piece === PAWN) {
            return { row: lastRow, column }
        }
    }
    return false
}