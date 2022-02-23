import React, { useState } from 'react'

import styles from './modal-game.module.css';

import {EndedBy} from 'chessxone-shared/types'
 
import { membersSocket } from '../../../../utils/socket-io-instance';
import Link from 'next/link';
import { ASK_REMATCH_EVENT } from 'chessxone-shared/events';
const ModalGameEnd = ({ handleAcceptRematch, endedBy, winner, handleRematch, handleSaveGame }) => {
    const [askedToRematch, setAskedToRematch] = useState(false);
    const [isAskingRematch, setIsAskingRematch] = useState(false);
    const [isWaitingForGame, setIsWaitingForGame] = useState(false);
    const [isSavingGame, setIsSavingGame] = useState(false)

    const isNotAllowedToRematch = (endedBy === EndedBy.TIME_OUT) || (endedBy === EndedBy.LEAVE_OUT)

    membersSocket.on(ASK_REMATCH_EVENT, () => {
        setAskedToRematch(true)

    })

    const AcceptRematch = () => {
        setIsWaitingForGame(true)
        handleAcceptRematch()
    }

    const askRematch = () => {
        setIsAskingRematch(true)
        handleRematch()
    }

    const saveGame = async () => {
        setIsSavingGame(true)
        await handleSaveGame()
        setIsSavingGame(false)
    }

    return (
        <div className={styles.modal_container}>
            <div>
                {(endedBy !== EndedBy.DRAW || endedBy !== EndedBy.STEAL_MATE) ? (
                    <p>{` ${winner} is The winner`}</p>
                ) : (
                        '------------'
                    )}
                <p style={{ fontSize: '2rem', fontFamily: 'minecraft' }}> {endedBy}</p>
                {!isNotAllowedToRematch && (
                    <div>
                        {askedToRematch ? (
                            <button  style={{color: 'var(--purple)'}} disabled={isWaitingForGame} onClick={AcceptRematch}>
                                Accept Re-match
                                {isWaitingForGame && <img src="/icon/loader.svg" height="15" width="15" />}
                            </button>
                        ) : (
                                <button disabled={isAskingRematch} onClick={askRematch}>
                                    Ask for Re-match
                                    {isAskingRematch && <img src="/icon/loader.svg" height="15" width="15" />}
                                </button>
                            )}
                        <button style={{marginTop: '1rem'}} disabled={isSavingGame} onClick={saveGame} >
                            Save Game
                            {isSavingGame && '..'}
                        </button>
                    </div>
                )}
                <button>
                    <Link href="/home">Back to Lobby</Link>
                </button>
            </div>
        </div>)
}

export default ModalGameEnd;
