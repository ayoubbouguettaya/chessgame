import React, { useContext, useCallback } from 'react'

import { gameContext } from '../../../../store/game/context'
import { SELECT_PIECE, MOVE_PIECE } from '../../../../store/game/actions';
import { BLACK, EMPTY } from '../../gameLogic/constants'
import * as eventEmitter from '../../gameLogic/eventEmitter'

import styles from './square.module.css';

const Square = ({ data }) => {
    const { dispatch,
        state: {
            selectedSquare,
            allowedSquares,
            gameID,
            kingHighlighted,
            previousTrackedSquare,
        } } = useContext(gameContext);

    const {
        bgColor,
        row,
        column,
        notation,
        piece,
        player,
    } = data;

    const isSelected = selectedSquare && selectedSquare.row === row && selectedSquare.column === column;
    const isHeilighted = allowedSquares && allowedSquares.findIndex((nextSquare) => (nextSquare.row === row && nextSquare.column === column)) !== -1
    const isPreviousTracked = previousTrackedSquare && previousTrackedSquare.row === row && previousTrackedSquare.column === column;
    const isKingHighlited = kingHighlighted && kingHighlighted.row === row && kingHighlighted.column === column;


    const handleSelectSquare = () => {
        dispatch({ type: SELECT_PIECE, payload: { row, column, piece } })
    }
   
    const handleMove = useCallback(() => {
        dispatch({ type: MOVE_PIECE, payload: { row, column, piece } })
        if (allowedSquares.findIndex((nextSquare) => (nextSquare.row === row && nextSquare.column === column)) !== -1) {
            eventEmitter.move(gameID, selectedSquare,{piece,row,column})
        }
    }, [allowedSquares, selectedSquare, gameID, dispatch])

    const handleClick = useCallback(
        () => {
            if (selectedSquare) {
                handleMove()
            } else {
                handleSelectSquare()
            }
        },
        [selectedSquare, handleMove],
    );

   
    const bgColorStyles = bgColor === BLACK ? styles.black : styles.white;

    return (
        <div
            aria-label={notation}
            className={`${styles.square} 
            ${bgColorStyles}
             ${isSelected ? styles.selected : ''}
              ${isHeilighted ? styles.isHeilighted : ''}
              ${isPreviousTracked ? styles.isPreviousTracked : ''}
              ${isKingHighlited ? styles.isKingHighlited : ''}
              `}
            onClick={handleClick}>
            {piece !== EMPTY && (<img src={`/pieces/${player}_${piece}.svg`} />)}
        </div>
    )
}

export default Square;
