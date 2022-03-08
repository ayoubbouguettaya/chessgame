import React, { useState, useEffect } from 'react'

import { setupBoard } from 'chessxone-shared/game/initialisation';
import { castleKing, movePiece } from 'chessxone-shared/game/moves';
import { parseNotation,parsePieceNotation  } from 'chessxone-shared/utils';

import DisplayBoard from './helpers/DisplayBoard';
import SidePanel from './helpers/SidePanel';
import { BLACK, KING_SIDE, QUEEN_SIDE, WHITE } from 'chessxone-shared/constants';

import styles from './automanaged-board.module.css'

const AutoManagedBoard = ({ blackPlayer, context, whitePlayer, keywords, moves,movesWithNotation,comments }) => {

    const [boardState, setBoardState] = useState([]);

    const [currentMove, setCurrentMove] = useState('');
    const [showCommentSection, setShowCommentSection] = useState(false);
    const [offsetMove, setOffsetMove] = useState(0);

    useEffect(() => {
        initiaseBoard()
    }, [])

    const handleNext = () => {
        /* Move pawn-promotion castling */
        if (offsetMove < moves.length) {
            setCurrentMove(moves[offsetMove + 1]);
            setOffsetMove((prev) => prev + 1);

            updateBoard();
        }
    }

    const initiaseBoard = () => {
        setBoardState(setupBoard());
        setCurrentMove(moves[0]);
        setOffsetMove(0)
    }

    const updateBoard = () => {        
        if(moves[offsetMove] === 'O-O'){
            castleKing(boardState,offsetMove % 2 === 0 ? WHITE : BLACK,KING_SIDE)
            setBoardState([...boardState]);
            return;
        }

        if(moves[offsetMove] === 'O-O-O'){
            castleKing(boardState,offsetMove % 2 === 0 ? WHITE : BLACK,QUEEN_SIDE)
            setBoardState([...boardState]);
            return;
        }

        let fromSquareNotation = moves[offsetMove].slice(0, 3);
        let toSquareNotation = moves[offsetMove].slice(3, 6);
        const fromSquare = parseNotation(fromSquareNotation.toUpperCase());
        const toSquare = parseNotation(toSquareNotation.toUpperCase());
        console.log(fromSquare.piece)
        setBoardState(movePiece(boardState, fromSquare, toSquare));

        if(moves[offsetMove].length === 8){
            // TODO: missing a test for pawn promotion
            const piecePromoteTo = parsePieceNotation(moves[offsetMove].charAt(7).toUpperCase());
            console.log('pawn promotion to ',piecePromoteTo);
            boardState[toSquare.row][toSquare.column].piece = piecePromoteTo;
            setBoardState([...boardState]);
        }
    }

    const toggleComment = () => {
        setShowCommentSection(prevS => !prevS)
    }

    return (
        <div className={`${styles.board_container} `}>
            <DisplayBoard boardState={boardState} />
            <SidePanel
                blackPlayer={blackPlayer}
                context={context}
                whitePlayer={whitePlayer}
                keywords={keywords}
                moves={moves}
                comments={comments}
                offsetMove={offsetMove}
                movesWithNotation={movesWithNotation}
                toggleComment={toggleComment}
                handleNext={handleNext}
                initiaseBoard={initiaseBoard}
                showComment={showCommentSection} />
        </div>
    )
}

export default AutoManagedBoard;

