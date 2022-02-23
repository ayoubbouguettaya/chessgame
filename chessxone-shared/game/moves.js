"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.castleKing = exports.getCastlePossibility = exports.isAllowedMove = exports.movePiece = exports.calculateAllowedSquares = void 0;
const lodash_1 = require("lodash");
const ending_1 = require("./ending");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const calculateAllowedSquares = (board, playerColor, row, column, piece) => {
    let allowedSquares = [];
    switch (piece) {
        case constants_1.PAWN:
            allowedSquares = calculatePawnMoves(board, playerColor, { row, column });
            break;
        case constants_1.kNIGHT:
            allowedSquares = calculateKnightMoves(board, playerColor, { row, column });
            break;
        case constants_1.BISHOP:
            allowedSquares = calculateBishopMoves(board, playerColor, { row, column });
            break;
        case constants_1.ROOK:
            allowedSquares = calculateRookMoves(board, playerColor, { row, column });
            break;
        case constants_1.KING:
            allowedSquares = calculateKingMoves(board, playerColor, { row, column });
            break;
        case constants_1.QUEEN:
            allowedSquares = calculateQueenMoves(board, playerColor, { row, column });
            break;
        default:
            break;
    }
    return allowedSquares;
};
exports.calculateAllowedSquares = calculateAllowedSquares;
const movePiece = (board, fromSquare, toSquare) => {
    const { row: fromRow, column: fromColumn } = fromSquare;
    const { row: toRow, column: toColumn } = toSquare;
    const boardClone = (0, lodash_1.cloneDeep)(board);
    const fromSquareCloned = boardClone[fromRow][fromColumn];
    boardClone[toRow][toColumn].piece = fromSquareCloned.piece;
    boardClone[toRow][toColumn].player = fromSquareCloned.player;
    /* deep clone the board to avoid any mistake with passing reference */
    const newBoard = (0, lodash_1.cloneDeep)(boardClone);
    newBoard[fromRow][fromColumn].piece = constants_1.EMPTY;
    return [...newBoard];
};
exports.movePiece = movePiece;
const calculatePawnMoves = (board, playerColor, selectedSquare) => {
    const allowedMoves = [];
    const stepAhead = (playerColor === constants_1.WHITE) ? -1 : 1;
    const rowStart = (playerColor === constants_1.WHITE) ? 6 : 1;
    const strightNextSquare = (0, utils_1.getPiece)(board, selectedSquare, stepAhead, 0);
    if (strightNextSquare && strightNextSquare.piece === constants_1.EMPTY) {
        allowedMoves.push(strightNextSquare);
        const strightNextSquare2 = (0, utils_1.getPiece)(board, selectedSquare, (stepAhead * 2), 0);
        if (selectedSquare.row === rowStart && strightNextSquare2 && strightNextSquare2.piece === constants_1.EMPTY) {
            allowedMoves.push(strightNextSquare2);
        }
    }
    const diagonaleLeftSquare = (0, utils_1.getPiece)(board, selectedSquare, stepAhead, 1);
    if (diagonaleLeftSquare && diagonaleLeftSquare.player !== playerColor && diagonaleLeftSquare.piece !== constants_1.EMPTY) {
        allowedMoves.push(diagonaleLeftSquare);
    }
    const diagonaleRightSquare = (0, utils_1.getPiece)(board, selectedSquare, stepAhead, -1);
    if (diagonaleRightSquare && diagonaleRightSquare.player !== playerColor && diagonaleRightSquare.piece !== constants_1.EMPTY) {
        allowedMoves.push(diagonaleRightSquare);
    }
    return allowedMoves;
};
const calculateKnightMoves = (board, playerColor, selectedSquare) => {
    const allowedMoves = [];
    const stepVariation = [-1, 1];
    const stepVariation2 = [-2, 2];
    let squareToJump, squareToJump2;
    for (let variation of stepVariation) {
        for (let variation2 of stepVariation2) {
            squareToJump = (0, utils_1.getPiece)(board, selectedSquare, variation, variation2);
            if (squareToJump && (squareToJump.piece === constants_1.EMPTY || squareToJump.player !== playerColor)) {
                allowedMoves.push(squareToJump);
            }
            squareToJump2 = (0, utils_1.getPiece)(board, selectedSquare, variation2, variation);
            if (squareToJump2 && (squareToJump2.piece === constants_1.EMPTY || squareToJump2.player !== playerColor)) {
                allowedMoves.push(squareToJump2);
            }
        }
    }
    return allowedMoves;
};
const calculateBishopMoves = (board, playerColor, selectedSquare) => {
    const allowedMoves = [];
    const { row, column } = selectedSquare;
    const stepVariation = [-1, 1];
    let step, nextSquare;
    for (let variat of stepVariation) {
        for (let variat2 of stepVariation) {
            step = 1;
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, step * variat2);
            while (nextSquare && nextSquare.piece === constants_1.EMPTY) {
                allowedMoves.push(nextSquare);
                step++;
                nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, step * variat2);
            }
            if (nextSquare && nextSquare.player !== playerColor) {
                allowedMoves.push(nextSquare);
            }
        }
    }
    return allowedMoves;
};
const calculateRookMoves = (board, playerColor, { row, column }) => {
    const allowedMoves = [];
    const stepVariation = [-1, 1];
    let step, nextSquare;
    for (let variat of stepVariation) {
        step = 1;
        nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, 0);
        while (nextSquare && nextSquare.piece === constants_1.EMPTY) {
            allowedMoves.push(nextSquare);
            step++;
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, 0);
        }
        if (nextSquare && nextSquare.player !== playerColor) {
            allowedMoves.push(nextSquare);
        }
        step = 1;
        nextSquare = (0, utils_1.getPiece)(board, { row, column }, 0, step * variat);
        while (nextSquare && nextSquare.piece === constants_1.EMPTY) {
            allowedMoves.push(nextSquare);
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, 0, step * variat);
            step++;
        }
        if (nextSquare && nextSquare.player !== playerColor) {
            allowedMoves.push(nextSquare);
        }
    }
    return allowedMoves;
};
const calculateQueenMoves = (board, playerColor, selectedSquare) => {
    return [...calculateBishopMoves(board, playerColor, selectedSquare), ...calculateRookMoves(board, playerColor, selectedSquare)];
};
const calculateKingMoves = (board, playerColor, selectedSquare) => {
    const allowedMoves = [];
    const stepVariation = [-1, 0, 1];
    let nextSquare;
    for (let var1 of stepVariation) {
        for (let var2 of stepVariation) {
            nextSquare = (0, utils_1.getPiece)(board, selectedSquare, var1, var2);
            if (nextSquare && (nextSquare.player !== playerColor || nextSquare.piece === constants_1.EMPTY)) {
                allowedMoves.push(nextSquare);
            }
        }
    }
    return allowedMoves;
};
const isAllowedMove = (allowedSquares, { row, column }) => {
    if (allowedSquares && allowedSquares.findIndex((nextSquare) => (nextSquare.row === row && nextSquare.column === column)) !== -1)
        return true;
    return false;
};
exports.isAllowedMove = isAllowedMove;
const getCastlePossibility = (board, playerColor) => {
    let newArrrayCastlePossibility = [];
    const { row, column } = (0, ending_1.getKingPosition)(board, playerColor);
    let tmpBoard, cloneBoard;
    let tmpCurrentSquare;
    /* queen side */
    let queenSidePossibility = true;
    let currentColumn = column - 1;
    while (currentColumn > 0) {
        tmpCurrentSquare = (0, utils_1.getPiece)(board, { row, column: currentColumn });
        if (tmpCurrentSquare && tmpCurrentSquare.piece !== constants_1.EMPTY) {
            queenSidePossibility = false;
            break;
        }
        cloneBoard = (0, lodash_1.cloneDeep)(board);
        tmpBoard = (0, exports.movePiece)(cloneBoard, { row, column }, { row, column: currentColumn });
        if ((0, ending_1.detectedCheck)(tmpBoard, playerColor, { row, column: currentColumn })) {
            queenSidePossibility = false;
            break;
        }
        currentColumn = currentColumn - 1;
    }
    if (queenSidePossibility) {
        newArrrayCastlePossibility.push(constants_1.QUEEN_SIDE);
    }
    /* king side */
    let kingSidePossibility = true;
    currentColumn = column + 1;
    while (currentColumn < 7) {
        tmpCurrentSquare = (0, utils_1.getPiece)(board, { row, column: currentColumn });
        if (tmpCurrentSquare && tmpCurrentSquare.piece !== constants_1.EMPTY) {
            kingSidePossibility = false;
            break;
        }
        cloneBoard = (0, lodash_1.cloneDeep)(board);
        let tmpBoard = (0, exports.movePiece)(cloneBoard, { row, column }, { row, column: currentColumn });
        if ((0, ending_1.detectedCheck)(tmpBoard, playerColor, { row, column: currentColumn })) {
            kingSidePossibility = false;
            break;
        }
        currentColumn = currentColumn + 1;
    }
    if (kingSidePossibility) {
        newArrrayCastlePossibility.push(constants_1.KING_SIDE);
    }
    return newArrrayCastlePossibility;
};
exports.getCastlePossibility = getCastlePossibility;
const castleKing = (board, playerColor, side) => {
    const castleRow = playerColor === constants_1.BLACK ? 0 : 7;
    if (side === constants_1.QUEEN_SIDE) {
        /* move the king */
        board[castleRow][4].piece = constants_1.EMPTY;
        board[castleRow][2].piece = constants_1.KING;
        /* move the rook */
        board[castleRow][0].piece = constants_1.EMPTY;
        board[castleRow][3].piece = constants_1.ROOK;
    }
    if (side === constants_1.KING_SIDE) {
        /* move the king */
        board[castleRow][4].piece = constants_1.EMPTY;
        board[castleRow][6].piece = constants_1.KING;
        /* move the rook */
        board[castleRow][7].piece = constants_1.EMPTY;
        board[castleRow][5].piece = constants_1.ROOK;
    }
};
exports.castleKing = castleKing;
