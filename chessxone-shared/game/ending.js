"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectedCheck = exports.getKingPosition = exports.filterCheckMoves = exports.checkForAnyLegalMove = void 0;
const moves_1 = require("./moves");
const utils_1 = require("../utils");
const constants_1 = require("../constants");
const checkForAnyLegalMove = (board, playerColor) => {
    let allowedSquares, currentSquare;
    let currentRow = 0;
    let currentColumn = 0;
    currentSquare = (0, utils_1.getPiece)(board, { row: currentRow, column: currentColumn });
    while (currentSquare) {
        currentColumn++;
        if (currentColumn === 8) {
            currentColumn = 0;
            currentRow++;
        }
        if (currentSquare.piece === constants_1.EMPTY || currentSquare.player !== playerColor) {
            currentSquare = (0, utils_1.getPiece)(board, { row: currentRow, column: currentColumn });
            continue;
        }
        allowedSquares = (0, moves_1.calculateAllowedSquares)(board, playerColor, currentSquare.row, currentSquare.column, currentSquare.piece || null);
        allowedSquares = (0, exports.filterCheckMoves)(allowedSquares, {
            board,
            playerColor,
            selectedSquare: currentSquare
        });
        /*
        check if this piece is not frozen if so  pick the next square
        */
        if (allowedSquares.length === 0) {
            currentSquare = (0, utils_1.getPiece)(board, { row: currentRow, column: currentColumn });
            continue;
        }
        /*
        in this case there is minimum one piece that can
         remove the check so there is no check mate bro
        */
        return true;
    }
    /* all the pieces are frozen check mate */
    return false;
};
exports.checkForAnyLegalMove = checkForAnyLegalMove;
const filterCheckMoves = (allowedSqaures, { board, playerColor, selectedSquare }) => {
    let kingSquare = (0, exports.getKingPosition)(board, playerColor);
    return allowedSqaures.filter((square) => {
        let tmpBoard = (0, moves_1.movePiece)(board, selectedSquare, square);
        if (selectedSquare.piece === constants_1.KING) {
            kingSquare = square;
        }
        if (!(0, exports.detectedCheck)(tmpBoard, playerColor, kingSquare)) {
            return true;
        }
        return false;
    });
};
exports.filterCheckMoves = filterCheckMoves;
const checkedByKing = (board, playerColor, { row, column }) => {
    const stepVariation = [-1, 0, 1];
    let nextSquare;
    for (let var1 of stepVariation) {
        for (let var2 of stepVariation) {
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, var1, var2);
            if (nextSquare && nextSquare.player !== playerColor && nextSquare.piece === constants_1.KING) {
                console.log('checked By king');
                return true;
            }
        }
    }
    return false;
};
const checkedByPawn = (board, playerColor, { row, column }) => {
    const stepToPawn = (playerColor === constants_1.WHITE) ? -1 : 1;
    const diagonaleLeftSquare = (0, utils_1.getPiece)(board, { row, column }, stepToPawn, 1);
    if (diagonaleLeftSquare && diagonaleLeftSquare.player !== playerColor && diagonaleLeftSquare.piece === constants_1.PAWN) {
        console.log('chech by pawn');
        return true;
    }
    const diagonaleRightSquare = (0, utils_1.getPiece)(board, { row, column }, stepToPawn, -1);
    if (diagonaleRightSquare && diagonaleRightSquare.player !== playerColor && diagonaleRightSquare.piece === constants_1.PAWN) {
        console.log('chech by pawn');
        return true;
    }
    return false;
};
const checkedOnL = (board, playerColor, { row, column }) => {
    const stepVariation = [-1, 1];
    const stepVariation2 = [-2, 2];
    let squareToJump, squareToJump2;
    for (let variation of stepVariation) {
        for (let variation2 of stepVariation2) {
            squareToJump = (0, utils_1.getPiece)(board, { row, column }, variation, variation2);
            if (squareToJump && squareToJump.player !== playerColor && squareToJump.piece === constants_1.kNIGHT) {
                console.log('ckecked by a knight');
                return true;
            }
            squareToJump2 = (0, utils_1.getPiece)(board, { row, column }, variation2, variation);
            if (squareToJump2 && squareToJump2.player !== playerColor && squareToJump2.piece === constants_1.kNIGHT) {
                console.log('ckecked by a knight');
                return true;
            }
        }
    }
    return false;
};
const checkedDiagonaly = (board, playerColor, { row, column }) => {
    const stepVariation = [-1, 1];
    let step, nextSquare;
    for (let variat of stepVariation) {
        for (let variat2 of stepVariation) {
            step = 1;
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, step * variat2);
            while (nextSquare && nextSquare.piece === constants_1.EMPTY) {
                step++;
                nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat, step * variat2);
            }
            if (nextSquare &&
                nextSquare.player !== playerColor &&
                (nextSquare.piece === constants_1.BISHOP || nextSquare.piece === constants_1.QUEEN)) {
                console.log('check diagonaly');
                return true;
            }
        }
    }
    return false;
};
const checkedStight = (board, playerColor, { row, column }) => {
    const stepVariation = [-1, 1];
    const stepVariation2 = ["stepOnlyRow", "stepOnlyColumn"];
    let step, nextSquare;
    let stepRowAbsorbant, stepColumnAbsorbant;
    for (let variat2 of stepVariation2) {
        if (variat2 === "stepOnlyRow") {
            stepRowAbsorbant = 1;
            stepColumnAbsorbant = 0;
        }
        else {
            stepRowAbsorbant = 0;
            stepColumnAbsorbant = 1;
        }
        for (let variat of stepVariation) {
            step = 1;
            nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat * stepRowAbsorbant, step * variat * stepColumnAbsorbant);
            while (nextSquare && nextSquare.piece === constants_1.EMPTY) {
                step++;
                nextSquare = (0, utils_1.getPiece)(board, { row, column }, step * variat * stepRowAbsorbant, step * variat * stepColumnAbsorbant);
            }
            if (nextSquare &&
                nextSquare.player !== playerColor &&
                (nextSquare.piece === constants_1.ROOK || nextSquare.piece === constants_1.QUEEN)) {
                console.log('checked strightly');
                return true;
            }
        }
    }
    return false;
};
const getKingPosition = (board, playerColor) => {
    let row, column, currentSquare;
    column = 0;
    row = (playerColor === constants_1.WHITE) ? 7 : 0;
    currentSquare = (0, utils_1.getPiece)(board, { row, column });
    while (currentSquare) {
        if (currentSquare.piece === constants_1.KING && currentSquare.player === playerColor) {
            break;
        }
        if (column === 7) {
            column = 0;
            if (playerColor === constants_1.WHITE) {
                row = row - 1;
            }
            else {
                row = row + 1;
            }
        }
        else {
            column = column + 1;
        }
        currentSquare = (0, utils_1.getPiece)(board, { row, column });
    }
    return currentSquare;
};
exports.getKingPosition = getKingPosition;
const detectedCheck = (board, playerColor, kingSquare = null) => {
    /*xhen your opponant make a move and he checked your king */
    let row, column;
    let tmpCurrentSquare;
    if (kingSquare) {
        /* to avoid search for king position when is done before on a loop for exemple */
        row = kingSquare.row;
        column = kingSquare.column;
    }
    else {
        tmpCurrentSquare = (0, exports.getKingPosition)(board, playerColor);
        if (!tmpCurrentSquare) {
            return false;
        }
        const { row: kingRow, column: kingColumn } = tmpCurrentSquare;
        row = kingRow;
        column = kingColumn;
    }
    /* going stright check for queen or hook*/
    if (checkedStight(board, playerColor, { row, column })) {
        return true;
    }
    /* going diagonaly check for bishop or queen */
    if (checkedDiagonaly(board, playerColor, { row, column })) {
        return true;
    }
    /* going L check for Knight */
    if (checkedOnL(board, playerColor, { row, column })) {
        return true;
    }
    /* going check for pawn */
    if (checkedByPawn(board, playerColor, { row, column })) {
        return true;
    }
    /* check by the King */
    if (checkedByKing(board, playerColor, { row, column })) {
        return true;
    }
    /* going one step back diagonaly check for pawn */
    return false;
};
exports.detectedCheck = detectedCheck;
