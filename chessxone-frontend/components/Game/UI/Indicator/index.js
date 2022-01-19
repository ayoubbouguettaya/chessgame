import React, { useState, useEffect, useContext, useRef } from 'react';

import { gameContext } from '../../../../store/game/context';
import { gameStatus, BLACK, WHITE } from '../../gameLogic/constants';
import { handleClaimTimeOut } from '../../gameLogic/eventEmitter'

import Box from '../../../UI/Box';

import styles from './indicator.module.css';

const Indicator = () => {
    const [timer, setTimer] = useState(60)
    const { state: {
        gameID,
        playerColor,
        status,
        runTimer,
        blackUserName,
        whiteUserName,
        turn,
    } } = useContext(gameContext)

    const isGameStartRef = useRef(false)
    
    const myUserName = playerColor === BLACK ? blackUserName : whiteUserName;
    const opponentUserName = playerColor === WHITE ? blackUserName : whiteUserName
    const isMyTurn = playerColor === turn

    useEffect(() => {
        const timer = setTimeout(() => {
            if(!isGameStartRef.current){
                if (playerColor === turn) {
                    handleClaimTimeOut(gameID)
                }
            }
            clearTimeout(timer)
        }, 10000);
    }, []);

    useEffect(() => {
        if (!isGameStartRef.current) { 
            isGameStartRef.current = true;
         }

        let interval;
        if (status !== gameStatus.running) {
            setTimer(0);
        } else {
            if (runTimer) {
                setTimer(60)
                interval = setInterval(() => {
                    setTimer((currentTimer) => {
                        if (currentTimer === 1) {
                            clearInterval(interval)
                            if (isMyTurn) {
                                handleClaimTimeOut(gameID)
                            }
                        }
                        return (currentTimer - 1)
                    });

                    if (timer === 0) {
                        clearInterval(interval)
                    }

                }, 1000)
            }
        }

        return () => {
            clearInterval(interval)
        }
    }, [isMyTurn, status, runTimer])

    return (
        <div className={styles.indicator_container}>
            <div className={`${styles.player_box} ${isMyTurn ? styles.is_myturn : ''}`}>
                <Box>
                    <p>{opponentUserName}</p>
                </Box>
            </div>
            <div className={styles.clock}>
                <div className={`${styles.opponent} ${!isMyTurn ? styles.is_myturn : ''}`}>
                    <span>
                        {!runTimer ?
                            '+' : (
                                timer < 10 ? `0${timer}` : `${timer}`
                            )}
                    </span>
                </div>
                <div className={`${styles.me} ${isMyTurn ? styles.is_myturn : ''}`}>
                    <span>
                        {!runTimer ?
                            '+' : (
                                timer < 10 ? `0${timer}` : `${timer}`
                            )}
                    </span>
                </div>
            </div>
            <div className={`${styles.player_box} ${!isMyTurn ? styles.is_myturn : ''}`}>
                <Box>
                    <p >
                        <span style={{ color: 'var(--purple)', fontSize: '20px' }}> * </span>
                        {myUserName} </p>
                </Box>
            </div>
        </div>
    )
}

export default Indicator
