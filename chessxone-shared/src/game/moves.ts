import { cloneDeep } from 'lodash';

import { getKingPosition, detectedCheck } from "./ending";

import { getPiece } from '../utils';
import {
    WHITE,
    PAWN,
    EMPTY,
    kNIGHT,
    BISHOP,
    ROOK,
    KING,
    QUEEN,
    BLACK,
    QUEEN_SIDE,
    KING_SIDE
} from "../constants";

import { Board, CastlingSide, Color, Column, Piece, Row, Square } from '../types';

export const calculateAllowedSquares = (
    board: Board, playerColor: Color, row: Row, column: Column, piece: Piece | null) => {
    let allowedSquares: Array<Square> = [];

    switch (piece) {
        case PAWN:
            allowedSquares = calculatePawnMoves(board, playerColor, { row, column })
            break;
        case kNIGHT:
            allowedSquares = calculateKnightMoves(board, playerColor, { row, column })
            break;
        case BISHOP:
            allowedSquares = calculateBishopMoves(board, playerColor, { row, column })
            break;
        case ROOK:
            allowedSquares = calculateRookMoves(board, playerColor, { row, column })
            break;
        case KING:
            allowedSquares = calculateKingMoves(board, playerColor, { row, column });
            break;
        case QUEEN:
            allowedSquares = calculateQueenMoves(board, playerColor, { row, column })
            break;
        default:
            break;

    }

    return allowedSquares;
}

export const movePiece = (board: Board,
    fromSquare: Square,
    toSquare: Square) => {

    const { row: fromRow, column: fromColumn } = fromSquare;
    const { row: toRow, column: toColumn } = toSquare;

    const boardClone = cloneDeep(board)

    const fromSquareCloned = boardClone[fromRow][fromColumn];

    boardClone[toRow][toColumn].piece = fromSquareCloned.piece;
    boardClone[toRow][toColumn].player = fromSquareCloned.player;
    /* deep clone the board to avoid any mistake with passing reference */

    const newBoard = cloneDeep(boardClone);
    newBoard[fromRow][fromColumn].piece = EMPTY;
    return [...newBoard];
}

const calculatePawnMoves = (board: Board, playerColor: Color, selectedSquare: Square) => {
    const allowedMoves: Array<Square> = [];
    const stepAhead = (playerColor === WHITE) ? -1 : 1;
    const rowStart = (playerColor === WHITE) ? 6 : 1;

    const strightNextSquare = getPiece(board, selectedSquare, stepAhead, 0)
    if (strightNextSquare && strightNextSquare.piece === EMPTY) {
        allowedMoves.push(strightNextSquare);

        const strightNextSquare2 = getPiece(board, selectedSquare, (stepAhead * 2), 0);
        if (selectedSquare.row === rowStart && strightNextSquare2 && strightNextSquare2.piece === EMPTY) {
            allowedMoves.push(strightNextSquare2);
        }
    }


    const diagonaleLeftSquare = getPiece(board, selectedSquare, stepAhead, 1);
    if (diagonaleLeftSquare && diagonaleLeftSquare.player !== playerColor && diagonaleLeftSquare.piece !== EMPTY) {
        allowedMoves.push(diagonaleLeftSquare);
    }

    const diagonaleRightSquare = getPiece(board, selectedSquare, stepAhead, -1);
    if (diagonaleRightSquare && diagonaleRightSquare.player !== playerColor && diagonaleRightSquare.piece !== EMPTY) {
        allowedMoves.push(diagonaleRightSquare);
    }

    return allowedMoves;
};  

const calculateKnightMoves = (board: Board, playerColor: Color, selectedSquare: Square) => {
    const allowedMoves: Array<Square> = [];
    const stepVariation = [-1, 1];
    const stepVariation2 = [-2, 2]
    let squareToJump, squareToJump2;

    for (let variation of stepVariation) {
        for (let variation2 of stepVariation2) {
            squareToJump = getPiece(board, selectedSquare, variation, variation2);
            if (squareToJump && (squareToJump.piece === EMPTY || squareToJump.player !== playerColor)) {
                allowedMoves.push(squareToJump)
            }
            squareToJump2 = getPiece(board, selectedSquare, variation2, variation);
            if (squareToJump2 && (squareToJump2.piece === EMPTY || squareToJump2.player !== playerColor)) {
                allowedMoves.push(squareToJump2)
            }
        }
    }

    return allowedMoves;
};

const calculateBishopMoves = (board: Board, playerColor: Color, selectedSquare: Square) => {
    const allowedMoves: Array<Square> = [];
    const { row, column } = selectedSquare;
    const stepVariation = [-1, 1];
    let step, nextSquare;
    for (let variat of stepVariation) {
        for (let variat2 of stepVariation) {
            step = 1;
            nextSquare = getPiece(board, { row, column }, step * variat, step * variat2)
            while (nextSquare && nextSquare.piece === EMPTY) {
                allowedMoves.push(nextSquare);
                step++;
                nextSquare = getPiece(board, { row, column }, step * variat, step * variat2)
            }
            if (nextSquare && nextSquare.player !== playerColor) {
                allowedMoves.push(nextSquare);
            }
        }
    }

    return allowedMoves;
};

const calculateRookMoves = (board: Board, playerColor: Color, { row, column }: Square) => {
    const allowedMoves: Array<Square> = [];
    const stepVariation = [-1, 1];
    let step, nextSquare;
    for (let variat of stepVariation) {
        step = 1;
        nextSquare = getPiece(board, { row, column }, step * variat, 0)
        while (nextSquare && nextSquare.piece === EMPTY) {
            allowedMoves.push(nextSquare);
            step++;
            nextSquare = getPiece(board, { row, column }, step * variat, 0)
        }
        if (nextSquare && nextSquare.player !== playerColor) {
            allowedMoves.push(nextSquare);
        }

        step = 1;
        nextSquare = getPiece(board, { row, column }, 0, step * variat)
        while (nextSquare && nextSquare.piece === EMPTY) {
            allowedMoves.push(nextSquare);
            nextSquare = getPiece(board, { row, column }, 0, step * variat)
            step++;
        }
        if (nextSquare && nextSquare.player !== playerColor) {
            allowedMoves.push(nextSquare);
        }

    }

    return allowedMoves;
};

const calculateQueenMoves = (board: Board, playerColor: Color, selectedSquare: Square) => {
    return [...calculateBishopMoves(board, playerColor, selectedSquare), ...calculateRookMoves(board, playerColor, selectedSquare)];
};

const calculateKingMoves = (board: Board, playerColor: Color, selectedSquare: Square) => {
    const allowedMoves: Array<Square> = [];
    const stepVariation = [-1, 0, 1];
    let nextSquare;
    for (let var1 of stepVariation) {
        for (let var2 of stepVariation) {
            nextSquare = getPiece(board, selectedSquare, var1, var2)
            if (nextSquare && (nextSquare.player !== playerColor || nextSquare.piece === EMPTY)) {
                allowedMoves.push(nextSquare);
            }
        }
    }
    return allowedMoves;
};

export const isAllowedMove = (allowedSquares: Array<Square>, { row, column }: Square) => {
    if (allowedSquares && allowedSquares.findIndex((nextSquare) => (nextSquare.row === row && nextSquare.column === column)) !== -1) return true;
    return false;
}

export const getCastlePossibility = (board: Board, playerColor: Color) => {
    let newArrrayCastlePossibility = [];
    const { row, column } = <Square>getKingPosition(board, playerColor);
    let tmpBoard, cloneBoard;

    let tmpCurrentSquare: Square | null;

    /* queen side */
    let queenSidePossibility = true;
    let currentColumn = column - 1;
    while (currentColumn > 0) {
        tmpCurrentSquare = getPiece(board, { row, column: currentColumn })
        if (tmpCurrentSquare && tmpCurrentSquare.piece !== EMPTY) {
            queenSidePossibility = false;
            break;
        }

        cloneBoard = cloneDeep(board)
        tmpBoard = movePiece(cloneBoard,
            { row, column },
            { row, column: <Column>currentColumn });


        if (detectedCheck(
            tmpBoard,
            playerColor,
            { row, column: <Column>currentColumn }
        )) {
            queenSidePossibility = false;
            break;
        }

        currentColumn = currentColumn - 1;
    }

    if (queenSidePossibility) {
        newArrrayCastlePossibility.push(QUEEN_SIDE);
    }

    /* king side */
    let kingSidePossibility = true;
    currentColumn = column + 1;
    while (currentColumn < 7) {
        tmpCurrentSquare = getPiece(board, { row, column: currentColumn })
        if (tmpCurrentSquare && tmpCurrentSquare.piece !== EMPTY) {
            kingSidePossibility = false;
            break;
        }

        cloneBoard = cloneDeep(board)
        let tmpBoard = movePiece(cloneBoard,
            { row, column },
            { row, column: <Column>currentColumn });

        if (detectedCheck(
            tmpBoard,
            playerColor,
            { row, column: <Column>currentColumn })) {
            kingSidePossibility = false;
            break;
        }

        currentColumn = currentColumn + 1;
    }
    if (kingSidePossibility) {
        newArrrayCastlePossibility.push(KING_SIDE);
    }

    return newArrrayCastlePossibility;
}

export const castleKing = (board: Board, playerColor: Color, side: CastlingSide) => {
    const castleRow = playerColor === BLACK ? 0 : 7;
    if (side === QUEEN_SIDE) {
        /* move the king */
        board[castleRow][4].piece = EMPTY;
        board[castleRow][2].piece = KING;
        /* move the rook */
        board[castleRow][0].piece = EMPTY;
        board[castleRow][3].piece = ROOK;
    }
    if (side === KING_SIDE) {
        /* move the king */
        board[castleRow][4].piece = EMPTY;
        board[castleRow][6].piece = KING;
        /* move the rook */
        board[castleRow][7].piece = EMPTY;
        board[castleRow][5].piece = ROOK;
    }

}
