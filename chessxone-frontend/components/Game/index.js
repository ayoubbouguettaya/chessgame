import React, { useState, useEffect, useContext, useRef } from 'react'

import { useRouter } from 'next/router'
import Indicator from './UI/Indicator';
import Board from './UI/Board';
import SideBarGame from './UI/SideBarGame';
import styles from './game.module.css'

import { gameContext } from '../../store/game/context';
import initialiseAllEventListner from './EventHandlers/eventsListners';

import { GameStatus } from 'chessxone-shared/types';

import * as eventEmitter from './EventHandlers/eventEmitter';
import ModalGameEnd from './UI/ModalGameEnd';
import ModalGameUnavailble from './UI/ModalGameUnavailable';
import fetchApi from '../../utils/apiFetch';
import { userContext } from '../../store/user/context';

const GameComponent = () => {
    const [gameID, setGameID] = useState('')
    const {
        dispatch,
        state: {
            status,
            endedBy,
            winner
        } } = useContext(gameContext)

    const {state: {user: { _id: userID }} } = useContext(userContext)

    const router = useRouter();

    const gameIDRef = useRef();

    useEffect(() => {
        gameIDRef.current = gameID;
    }, [gameID]);

    useEffect(() => {
        const { gameID: gameIDparams } = router.query;
        if (gameIDparams) {
            setGameID(gameIDparams);
            eventEmitter.handleJoinGame(gameIDparams);
        }
    }, [router.query]);

    useEffect(() => {
        initialiseAllEventListner(dispatch)

        return async () => {
            await eventEmitter.leaveGame(gameIDRef.current)
        }

    }, []);

    if (status === GameStatus.loading) {
        return (<div className={styles.loading_container}><p>Loading game </p></div>);
    }

    const handleRematch = () => {
        eventEmitter.handleAskRematch(gameID)
    }

    const handleAcceptRematch = () => {
        eventEmitter.handleAcceptRematch(gameID)
    }

    const handleSaveGame = async () => {
        try {
            await fetchApi.put({url: `/saved-games/${gameID}/personal/${userID}`})
        } catch (error) {

        }
    }

    return (
        <div>
            {status === GameStatus.ended && (
                <ModalGameEnd
                    endedBy={endedBy}
                    winner={winner}
                    handleRematch={handleRematch}
                    handleAcceptRematch={handleAcceptRematch}
                    handleSaveGame={handleSaveGame}
                />
            )}
            {status === GameStatus.not_available && (
                <ModalGameUnavailble />
            )}
            <div className={styles.game_container}>
                <Indicator />
                <Board />
                <SideBarGame />
            </div>
        </div>
    )
}

export default GameComponent
