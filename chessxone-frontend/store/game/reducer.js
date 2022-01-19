import {
    SETUP_BOARD,
    SELECT_PIECE,
    MOVE_PIECE,
    OPPONENT_MOVE_PIECE,
    SELF_MOVE_PIECE,

    PAWN_PROMOTION,
    OPPONENT_PAWN_PROMOTION,

    OPPONENT_CASTLING_KING,
    CASTLING_KING,

    GAME_END,
    GAME_NOT_AVAILABLE,
} from './actions';

import { setupBoard } from '../../components/Game/gameLogic/initialisation';
import {
    EMPTY,
    gameStatus,
    PAWN,
    BLACK,
    ROOK,
    KING,
    WHITE,
    QUEEN_SIDE,
    KING_SIDE,
    BOTH_SIDE,
} from '../../components/Game/gameLogic/constants';

import {
    parseNotation,
    switchTurn,
    getPawnPromotion,
} from '../../components/Game/gameLogic/utils';

import {
    calculateAllowedSquares,
    movePiece,
    getCastlePossibility,
    castleKing,
} from '../../components/Game/gameLogic/movesLogic';

import {
    detectedCheck,
    filterCheckMoves,
    checkForAnyLegalMove,
    getKingPosition,
} from '../../components/Game/gameLogic/endGameLogic';

import * as eventEmitter from '../../components/Game/gameLogic/eventEmitter';

const vibrate = () => {
    if (window && window.navigator) {
        const canVibrate = window.navigator.vibrate
        if (canVibrate) window.navigator.vibrate(100)
    }
}

const reducer = (state, action) => {
    switch (action.type) {
        case SETUP_BOARD: {
            const { playerColor, blackUserName, whiteUserName, turn, gameID, hosterWin, guestWin } = action.payload;

            return {
                ...state,
                gameID,
                board: setupBoard(),
                playerColor,
                blackUserName,
                whiteUserName,
                turn,
                status: gameStatus.running,
                message: 'the game start',
                winner: '',
                waitPromotePawn: false,
                opponentPawnToPromote: undefined,
                possibilityToCastle: [], /* QUEEN_SIDE KING_SIDE BOTH_SIDE */
                forbidenToCastle: [],
                hosterWin,
                guestWin
            }
        }
        case GAME_NOT_AVAILABLE: {
            return { ...state, status: gameStatus.not_available }
        }
        case SELECT_PIECE: {
            const { row, column, piece } = action.payload;
            const { board, playerColor, turn, forbidenToCastle } = state;

            if (turn !== playerColor) {
                return state;
            }
            if (piece === EMPTY || board[row][column].player !== playerColor) {
                return { ...state, allowedSquares: [] };
            }
            /* calculate allowed moves */
            let allowedSquares = calculateAllowedSquares({ board, playerColor, row, column, piece });
            /* 
            filter the moves that causes a check
            */
            allowedSquares = filterCheckMoves(allowedSquares, { board, playerColor, selectedSquare: { row, column, piece } });

            let newMessage = `you select ${piece}`;
            if (allowedSquares.length === 0) {
                newMessage = `you can't move ${piece}`;
            }
            let possibilityToCastle = [];
            if (piece === KING && !forbidenToCastle.includes(BOTH_SIDE)) {
                /* check for castle possibility  possibilityToCastle*/
                possibilityToCastle = getCastlePossibility(board, playerColor)
            }

            return {
                ...state,
                selectedSquare: { row, column, piece },
                allowedSquares,
                message: newMessage,
                previousTrackedSquare: undefined,
                possibilityToCastle: [...possibilityToCastle]
            }
        }
        case MOVE_PIECE: {
            const { row, column } = action.payload;
            const {
                board,
                playerColor,
                allowedSquares,
                forbidenToCastle,
                possibilityToCastle,
                selectedSquare = ''
            } = state;

            if (!selectedSquare) {
                return state;
            }

            const { row: selectedSquareRow, column: selectedSquareColumn } = selectedSquare;

            let turn = switchTurn(playerColor)
            let waitPromotePawn = false;
            let newPossibilityToCastle = [...possibilityToCastle];

            if (allowedSquares.findIndex((nextSquare) => (nextSquare.row === row && nextSquare.column === column)) === -1) {
                return {
                    ...state,
                    selectedSquare: undefined,
                    allowedSquares: [],
                };
            }
            const newBoard = movePiece(board, { row: selectedSquareRow, column: selectedSquareColumn }, { row, column });
            if (newBoard[row][column].piece === PAWN) {
                const pawnToPromote = getPawnPromotion(newBoard, playerColor);
                if (pawnToPromote) {
                    waitPromotePawn = true;
                    turn = playerColor;
                }
            }

            if (board[selectedSquareRow][selectedSquareColumn].piece === KING) {
                forbidenToCastle.push(BOTH_SIDE)
                newPossibilityToCastle = [];
            }

            if (forbidenToCastle.includes(BOTH_SIDE) && board[selectedSquareRow][selectedSquareColumn].piece === ROOK) {
                if (!forbidenToCastle.includes(QUEEN_SIDE) && selectedSquareColumn === 0) {
                    forbidenToCastle.push(QUEEN_SIDE)
                    newPossibilityToCastle = newPossibilityToCastle.filter((rule) => rule === KING_SIDE)
                }
                if (!forbidenToCastle.includes(KING_SIDE) && selectedSquareColumn === 7) {
                    forbidenToCastle.push(KING_SIDE)
                    newPossibilityToCastle = newPossibilityToCastle.filter((rule) => rule === QUEEN_SIDE)
                }
            }

            return {
                ...state,
                board: [...newBoard],
                selectedSquare: undefined,
                allowedSquares: [],
                kingHighlighted: undefined,
                previousTrackedSquare: undefined,
                turn,
                waitPromotePawn,
                forbidenToCastle: [...forbidenToCastle],
                possibilityToCastle: newPossibilityToCastle,
                message: 'Now , it\'s your opponent turn',
                runTimer: true,
            }
        }
        case OPPONENT_MOVE_PIECE: {
            const { from, to } = action.payload;
            const {
                gameID,
                board,
                turn,
                playerColor,
                message,
                status
            } = state;

            const fromSquare = parseNotation(from)
            const toSquare = parseNotation(to)

            let newMessage = message;
            let newStatus = status;
            let kingHighlighted;
            let NewTurn = playerColor;

            if (turn === playerColor) {
                return {
                    ...state,
                }
            }

            /* 
           detect if there is a pawn promotion earlier to avoid make the move and the needed calculation
           and react like this:
                dont switch the move instead save the move and do the calculation later
            make the move later on.
             */
            let opponentBeforePromotionRow = playerColor === BLACK ? 1 : 6;
            if (board[fromSquare.row][fromSquare.column].piece === PAWN && opponentBeforePromotionRow === fromSquare.row
            ) {
                return { ...state, message: 'wait for pawn promotion', opponentPawnToPromote: { from, to } }
            }

            /*
             Move the piece
              */
            const newBoard = movePiece(board, fromSquare, toSquare);

            if (!checkForAnyLegalMove({ board: newBoard, playerColor })) {
                if (detectedCheck({ board: newBoard, playerColor })) {
                    newMessage = 'the king is check mated';
                    eventEmitter.handleClaimCheckMate(gameID)
                } else {
                    newMessage = 'steal mate';
                    eventEmitter.handleClaimStealMate(gameID)
                }
                newStatus = gameStatus.ended;
            } else {
                if (detectedCheck({ board: newBoard, playerColor })) {
                    newMessage = 'the king is checked';
                    /* highlight king */
                    kingHighlighted = getKingPosition(newBoard, playerColor)
                } else {
                    newMessage = `the opponent moved ${fromSquare.piece}`;
                }
            }

            vibrate()

            return {
                ...state,
                board: [...newBoard],
                turn: NewTurn,
                message: newMessage,
                status: newStatus,
                previousTrackedSquare: { row: fromSquare.row, column: fromSquare.column },
                kingHighlighted,
                runTimer: true,
            }
        }
        case PAWN_PROMOTION: {
            const { piece } = action.payload;
            const { board, playerColor } = state;
            const pawnToPromote = getPawnPromotion(board, playerColor);

            if (!pawnToPromote) {
                /* consider end game for weird behaviour in logic game*/
                return state;
            }

            const { row, column } = pawnToPromote;

            board[row][column].piece = piece;
            return {
                ...state,
                turn: switchTurn(playerColor),
                board: [...board],
                waitPromotePawn: false,
            };
        }
        case OPPONENT_PAWN_PROMOTION: {
            /*
            -----------------------------------------------------------------------
            */
            const { piece } = action.payload;
            const {
                board,
                turn,
                playerColor,
                message,
                status,
                opponentPawnToPromote = ''
            } = state;

            if (!opponentPawnToPromote) {
                return state;
            }

            const fromSquare = parseNotation(opponentPawnToPromote.from);
            const toSquare = parseNotation(opponentPawnToPromote.to);

            let newMessage = message;
            let newStatus = status;
            let kingHighlighted;
            let NewTurn = playerColor;

            if (turn === playerColor) {
                newMessage = "ops, something want wrong, game canceled,please report this behaviour ";
                return {
                    ...state,
                    status: gameStatus.ended,
                    message: newMessage,
                }
            }

            /*
             Move the piece
              */
            board[fromSquare.row][fromSquare.column].piece = piece;
            const newBoard = movePiece(board, fromSquare, toSquare);

            if (!checkForAnyLegalMove({ board: newBoard, playerColor })) {
                if (detectedCheck({ board: newBoard, playerColor })) {
                    newMessage = 'the king is check mated';
                } else {
                    newMessage = 'steal mate';
                }
                newStatus = gameStatus.ended;
            } else {
                if (detectedCheck({ board: newBoard, playerColor })) {
                    newMessage = 'the king is checked';
                    /* highlight king */
                    kingHighlighted = getKingPosition(newBoard, playerColor)
                } else {
                    newMessage = `the opponent moved ${fromSquare.piece}`;
                }
            }

            vibrate()

            return {
                ...state,
                board: [...newBoard],
                turn: NewTurn,
                message: newMessage,
                status: newStatus,
                previousTrackedSquare: { row: fromSquare.row, column: fromSquare.column },
                kingHighlighted,
                opponentPawnToPromote: undefined
            }
            /* 
            ----------------------------------------------------------
            it's quite the same logic as opponent move- piece --------
            -----------so later on i have to refactor this parts------
            ----------------------------------------------------------
            */
        }
        case GAME_END: {
            const { endedBy, winner } = action.payload;
            const messageToShow = `Game Ended by ${endedBy} ${winner ? `${winner} | Won the Game` : ''}`;
            vibrate()

            return {
                ...state,
                status: gameStatus.ended,
                winner,
                endedBy: endedBy,
                message: messageToShow,
            }
        }
        case CASTLING_KING: {
            const { side } = action.payload;
            const { board, playerColor } = state;
            castleKing(board, playerColor, side)

            return {
                ...state,
                board: [...board],
                message: `castle king made (${side.replace('_', ' ')})`,
                turn: switchTurn(playerColor),
                possibilityToCastle: [],
                forbidenToCastle: [BOTH_SIDE],
                selectedSquare: undefined,
                allowedSquares: [],
                kingHighlighted: undefined,
                previousTrackedSquare: undefined,
            };
        }
        case OPPONENT_CASTLING_KING: {
            const { side } = action.payload;
            const { board, playerColor } = state;
            castleKing(board, switchTurn(playerColor), side)

            vibrate()
            return {
                ...state,
                board: [...board],
                message: `opponent castle king made (${side.replace('_', ' ')})`,
                turn: playerColor,
            };
        }
        default:
            return { ...state };
    }
}

export default reducer;
