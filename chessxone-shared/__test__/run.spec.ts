import { setupBoard } from '../game/initialisation';
import { calculateAllowedSquares, movePiece } from '../game/moves'
import { filterCheckMoves } from '../game/ending'

import { Board, Column, Piece, Row } from '../types';
import { BLACK, PAWN, EMPTY, ROOK, QUEEN, KING, WHITE } from '../constants'

let board: Board;

beforeEach(() => {
    board = <Board>setupBoard();
});

it('initialisation', () => {
    expect(board[0][0].piece).toBe(ROOK); expect(board[0][0].player).toBe(BLACK);
    /* [0,1] [0,2]*/
    expect(board[0][3].piece).toBe(QUEEN); expect(board[0][3].player).toBe(BLACK);
    /*
    ..
    ..
     */
    expect(board[6][7].piece).toBe(PAWN); expect(board[6][7].player).toBe(WHITE);
    /* 
    ..
    ..
    */
    expect(board[7][4].piece).toBe(KING); expect(board[7][4].player).toBe(WHITE);
    /* .. [7,5] [7,6] [7,7] */
})

it('select and move a PAWN', () => {
    let allowedSquares = calculateAllowedSquares(board, BLACK, 1, 0, PAWN);
    expect(allowedSquares.length).toBe(2)

    allowedSquares = filterCheckMoves(allowedSquares, { board, playerColor: BLACK, selectedSquare: { row: 1, column: 0 } })
    expect(allowedSquares.length).toBe(2)

    const selectedSquare = { row: <Row>1, column: <Column>0, piece: <Piece>PAWN }
    const ToSquare = { row: <Row>2, column: <Column>0 }

    const newBoard = movePiece(board, selectedSquare, ToSquare);

    expect(newBoard[1][0].piece).toBe(EMPTY)
    expect(newBoard[2][0].piece).toBe(PAWN)
})

