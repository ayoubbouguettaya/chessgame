/* 
this Board Component just display the Pieces in the Board without managing any State.
*/
import React from 'react'

import { BLACK, columnNotation, EMPTY, rowNotation } from 'chessxone-shared/constants'

import styles from '../automanaged-board.module.css'

const DisplayBoard = ({boardState}) => {
    return (
        <>
              <div className={` ${styles.vertical_notation}`}>
                {rowNotation.map((index) => (<span key={index}> {index}</span>))}
            </div>
            <div>
                <div className={` ${styles.board}`} >
                    {boardState.map((row) => {
                        return (row.map((square) => (
                            <DumpSquare key={`${square.row}-${square.column}`} {...square} />
                        )))
                    })}
                </div>
                <div className={`${styles.horizontal_notation}`}>
                    {columnNotation.map((index) => (<span key={index}> {index}</span>))}
                </div>
            </div>
        </>
    )
}

export default DisplayBoard

const DumpSquare = ({
    bgColor,
    notation,
    piece,
    player }) => {

    const bgColorStyles = bgColor === BLACK ? styles.black : styles.white;

    return (
        <div
            aria-label={notation}
            className={`${styles.square} 
            ${bgColorStyles}
              `}
        >
            {piece !== EMPTY && (<img src={`/pieces/${player}_${piece}.svg`} />)}
        </div>
    )
}
