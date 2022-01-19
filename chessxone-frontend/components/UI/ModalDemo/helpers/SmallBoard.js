import React,{useState} from 'react'

import styles from './small-board.module.css';
import { PAWN, BLACK, WHITE, EMPTY, KING } from '../../../../game/constants';
import SmallSquare from './SmallSquare';

const initialBoardInfo = [
    {index: 0, bgColor: WHITE,piece: EMPTY,player: BLACK, },
    {index: 1, bgColor: BLACK,piece: EMPTY,player: BLACK, },
    {index: 2, bgColor: WHITE,piece: EMPTY,player: BLACK, },

    {index: 3, bgColor: BLACK,piece: PAWN,player: WHITE, },

    {index: 4, bgColor: WHITE,piece: EMPTY,player: BLACK, },
    {index: 5, bgColor: BLACK,piece: EMPTY,player: BLACK, },
    {index: 6, bgColor: WHITE,piece: EMPTY,player: WHITE, },

    {index: 7, bgColor: BLACK,piece: KING,player: BLACK, blur: false},

    {index: 8, bgColor: WHITE,piece: EMPTY,player: WHITE, },
]
const SmallBoard = ({step,setStep}) => {
    const [boardInfo,setBoardInfo] = useState(initialBoardInfo)

    const makeAction = (stepParams,board) =>{
        if (stepParams === 0){
            board[7].blur = true
            board[7].isSelected = true;
            board[3].blur = false;
            board[3].isHeilighted = true;
        }
        if (stepParams === 1){
            board[3].blur = false;
            board[3].isHeilighted = false;
            board[3].piece = KING;
            board[7].isSelected = false;
            board[7].isHeilighted = true;
            board[7].piece = EMPTY;
        }
    }

const nextStep = () => {
    setBoardInfo((previousBoard) => {
        makeAction(step,previousBoard)
       return [...previousBoard]
    })
    setStep((pStep) => pStep + 1)
}

    return (
        <div className={styles.small_board}>
            {boardInfo.map((data) => (<SmallSquare key={data.index} {...data} handleClick={nextStep} />))}
        </div>
    )
}

export default SmallBoard
