import { movePiece, calculateAllowedSquares } from "./moves";
import { getPiece } from "../utils";
import {
    KING,
    WHITE,
    ROOK,
    EMPTY,
    QUEEN,
    BISHOP,
    kNIGHT,
    PAWN
} from "../constants";
import { Board, Color, Square } from "../types";

export const checkForAnyLegalMove = (board: Board, playerColor: Color) => {
    let allowedSquares, currentSquare;
    let currentRow = 0;
    let currentColumn = 0;

    currentSquare = getPiece(board, { row: currentRow, column: currentColumn })
    while (currentSquare) {
        currentColumn++;
        if (currentColumn === 8) {
            currentColumn = 0;
            currentRow++;
        }
        if (currentSquare.piece === EMPTY || currentSquare.player !== playerColor) {
            currentSquare = getPiece(board, { row: currentRow, column: currentColumn })
            continue;
        }
        allowedSquares = calculateAllowedSquares(
            board,
            playerColor,
            currentSquare.row,
            currentSquare.column,
            currentSquare.piece || null,
        );
        allowedSquares = filterCheckMoves(
            allowedSquares,
            {
                board,
                playerColor,
                selectedSquare: currentSquare
            });

        /*
        check if this piece is not frozen if so  pick the next square
        */

        if (allowedSquares.length === 0) {
            currentSquare = getPiece(board, { row: currentRow, column: currentColumn })
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
}

export const filterCheckMoves = (
    allowedSqaures: Square[],
    { board, playerColor, selectedSquare }: { board: Board, playerColor: Color, selectedSquare: Square }) => {

    let kingSquare: Square | null = getKingPosition(board, playerColor)

    return allowedSqaures.filter((square) => {
        let tmpBoard = movePiece(board, selectedSquare, square);
        if (selectedSquare.piece === KING) {
            kingSquare = square;
        }

        if (!detectedCheck(tmpBoard, playerColor, kingSquare)) {
            return true;
        }
        return false;
    })
}

const checkedByKing = (board: Board, playerColor: Color, { row, column }: Square) => {
    const stepVariation = [-1, 0, 1];
    let nextSquare;

    for (let var1 of stepVariation) {
        for (let var2 of stepVariation) {
            nextSquare = getPiece(board, { row, column }, var1, var2)

            if (nextSquare && nextSquare.player !== playerColor && nextSquare.piece === KING) {
                console.log('checked By king')
                return true
            }
        }
    }

    return false;
}

const checkedByPawn = (board: Board, playerColor: Color, { row, column }: Square) => {
    const stepToPawn = (playerColor === WHITE) ? -1 : 1;

    const diagonaleLeftSquare = getPiece(board, { row, column }, stepToPawn, 1);
    if (diagonaleLeftSquare && diagonaleLeftSquare.player !== playerColor && diagonaleLeftSquare.piece === PAWN) {
        console.log('chech by pawn')
        return true;
    }

    const diagonaleRightSquare = getPiece(board, { row, column }, stepToPawn, -1);
    if (diagonaleRightSquare && diagonaleRightSquare.player !== playerColor && diagonaleRightSquare.piece === PAWN) {
        console.log('chech by pawn')
        return true;
    }
    return false;
}

const checkedOnL = (board: Board, playerColor: Color, { row, column }: Square) => {
    const stepVariation = [-1, 1];
    const stepVariation2 = [-2, 2]
    let squareToJump, squareToJump2;

    for (let variation of stepVariation) {
        for (let variation2 of stepVariation2) {
            squareToJump = getPiece(board, { row, column }, variation, variation2);

            if (squareToJump && squareToJump.player !== playerColor && squareToJump.piece === kNIGHT) {
                console.log('ckecked by a knight')
                return true;
            }
            squareToJump2 = getPiece(board, { row, column }, variation2, variation);

            if (squareToJump2 && squareToJump2.player !== playerColor && squareToJump2.piece === kNIGHT) {
                console.log('ckecked by a knight')
                return true;
            }
        }
    }
    return false;
}

const checkedDiagonaly = (board: Board, playerColor: Color, { row, column }: Square) => {
    const stepVariation = [-1, 1];
    let step, nextSquare;

    for (let variat of stepVariation) {
        for (let variat2 of stepVariation) {
            step = 1;
            nextSquare = getPiece(board, { row, column }, step * variat, step * variat2)
            while (nextSquare && nextSquare.piece === EMPTY) {
                step++;
                nextSquare = getPiece(board, { row, column }, step * variat, step * variat2)
            }

            if (nextSquare &&
                nextSquare.player !== playerColor &&
                (nextSquare.piece === BISHOP || nextSquare.piece === QUEEN)) {
                console.log('check diagonaly')
                return true;
            }
        }
    }

    return false;
}

const checkedStight = (board: Board, playerColor: Color, { row, column }: Square) => {
    const stepVariation = [-1, 1];
    const stepVariation2 = ["stepOnlyRow", "stepOnlyColumn"]
    let step, nextSquare;
    let stepRowAbsorbant, stepColumnAbsorbant;

    for (let variat2 of stepVariation2) {
        if (variat2 === "stepOnlyRow") {
            stepRowAbsorbant = 1;
            stepColumnAbsorbant = 0;
        } else {
            stepRowAbsorbant = 0
            stepColumnAbsorbant = 1;
        }

        for (let variat of stepVariation) {
            step = 1;
            nextSquare = getPiece(board, { row, column }, step * variat * stepRowAbsorbant, step * variat * stepColumnAbsorbant)
            while (nextSquare && nextSquare.piece === EMPTY) {
                step++;
                nextSquare = getPiece(board, { row, column }, step * variat * stepRowAbsorbant, step * variat * stepColumnAbsorbant)
            }
            if (nextSquare &&
                nextSquare.player !== playerColor &&
                (nextSquare.piece === ROOK || nextSquare.piece === QUEEN)) {
                console.log('checked strightly')
                return true
            }
        }
    }

    return false;
}

export const getKingPosition = (board: Board, playerColor: Color) => {
    let row, column, currentSquare;
    column = 0;
    row = (playerColor === WHITE) ? 7 : 0;

    currentSquare = getPiece(board, { row, column });
    while (currentSquare) {
        if (currentSquare.piece === KING && currentSquare.player === playerColor) {
            break;
        }
        if (column === 7) {
            column = 0;
            if (playerColor === WHITE) {
                row = row - 1;
            } else {
                row = row + 1;
            }
        } else {
            column = column + 1
        }
        currentSquare = getPiece(board, { row, column });
    }

    return currentSquare;
}

export const detectedCheck = (board: Board, playerColor: Color, kingSquare: Square | null = null) => {
    /*xhen your opponant make a move and he checked your king */
    let row, column;
    let tmpCurrentSquare: Square | null;

    if (kingSquare) {
        /* to avoid search for king position when is done before on a loop for exemple */
        row = kingSquare.row;
        column = kingSquare.column
    } else {
        tmpCurrentSquare = getKingPosition(board, playerColor);
        if (!tmpCurrentSquare) {
            return false;
        }

        const { row: kingRow, column: kingColumn } = tmpCurrentSquare;
        row = kingRow;
        column = kingColumn
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
        return true
    }
    /* going one step back diagonaly check for pawn */
    return false;
}