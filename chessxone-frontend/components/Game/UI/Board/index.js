import React, { useContext } from 'react';
import { gameContext } from '../../../../store/game/context'

import styles from './board.module.css'
import Square from '../Square';
import { BLACK, rowNotation, columnNotation, gameStatus } from '../../gameLogic/constants';

const Board = () => {
    const { state: { board,status,playerColor } } = useContext(gameContext);
    const rotateBoard = playerColor === BLACK;

    return (
        <div className={`${styles.board_container} ${status === gameStatus.ended ? styles.disabled : ''}`}>
            <div className={`${rotateBoard ? styles.rotate : ''} ${styles.vertical_notation}`}>
                {rowNotation.map((index) => (<span key={index}> {index}</span>))}
            </div>
            <div>
                <div className={`${rotateBoard ? styles.rotate : ''} ${styles.board}`} >
                    {board.map((row) => {
                        return (row.map((square) => (
                            <Square  key={`${square.row}-${square.column}`} data={square} />
                        )))
                    })}
                </div>
                <div className={`${rotateBoard ? styles.rotate : ''} ${styles.horizontal_notation}`}>
                    {columnNotation.map((index) => (<span key={index}> {index}</span>))}
                </div>
            </div>
        </div>
    )
}

export default Board
