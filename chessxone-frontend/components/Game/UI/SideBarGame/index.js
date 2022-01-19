import React, { useContext } from 'react'

import { gameContext } from '../../../../store/game/context'
import { PAWN_PROMOTION, CASTLING_KING } from '../../../../store/game/actions'
import { QUEEN, kNIGHT, BISHOP, ROOK, gameStatus } from '../../gameLogic/constants';
import * as eventEmitter from '../../gameLogic/eventEmitter'

import Box from '../../../UI/Box';
import styles from './sidebargame.module.css';

const SideBarGame = () => {
    const { dispatch,
        state: {
            gameID,
            playerColor,
            waitPromotePawn,
            status,
            possibilityToCastle,
            message,
            hosterWin,guestWin
        } } = useContext(gameContext);

    const handlePawnPromotion = (piece) => {
        dispatch({ type: PAWN_PROMOTION, payload: { piece } })
        eventEmitter.handlePawnPromotion(gameID, piece)
    }

    const handleCastleKing = (side) => {
        dispatch({ type: CASTLING_KING, payload: { side } })
        eventEmitter.handleCastleKing(gameID, side)
    }

    const handleResign = () => {
        eventEmitter.handleEmitResign(gameID)
    }

    const handleOffreDraw = () => {
        eventEmitter.handleOfferDraw(gameID)
    }

    return (
        <div className={styles.side_bar_container}>
            {status === gameStatus.running && (
                <div className={styles.resign_box}>
                    <Box >
                        <button onClick={handleResign}>
                            Resign
                    <img src="/icon/flags.svg" alt="flag icon by icon4free" height="18" width="18" />
                        </button>
                        <button onClick={handleOffreDraw} >
                            Offer a draw
                    </button>
                    </Box>
                </div>
            )}
            <div className={styles.status_box}>
                <Box >
                    <p>{message}</p>
                </Box>
            </div>
            <div className={styles.score_box}>
                <p>{hosterWin}-{guestWin}</p>
            </div>
            {waitPromotePawn &&
                (<Box>
                    <p> Promote the Pawn</p>
                    <PawnPromotionBox player={playerColor} handlePawnPromotion={handlePawnPromotion} />
                </Box>)}
            {possibilityToCastle && possibilityToCastle.length > 0 && (
                <Box>
                    <p>Castle the King</p>
                    {possibilityToCastle.map((side) => (
                        <button key={side} onClick={() => handleCastleKing(side)}>
                            {side.replace('_', ' ')}
                        </button>
                    ))}
                </Box>
            )}
        </div>
    )
}

export default SideBarGame

const PawnPromotionBox = ({ player, handlePawnPromotion }) => {
    const pieces = [QUEEN, BISHOP, kNIGHT, ROOK];
    return (<div className={styles.pawn_promotion_box}>
        {pieces.map((piece) => (
            <button key={piece} onClick={() => handlePawnPromotion(piece)}>
                <img src={`/pieces/${player}_${piece}.svg`} />
            </button>))}
    </div>)
}