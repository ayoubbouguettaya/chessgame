import React, { useContext, useState, useEffect } from 'react'

import styles from '../home.module.css';
import Loading from '../../UI/Loading';
import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import { SET_USER_GAME_REQUEST } from '../../../store/user/actions';

const WaitingOpponent = () => {
    const { dispatch, state: { user: { _id: userID }, userGameRequest } } = useContext(userContext);
    
    const getUserGameRequest = async () => {
        try {
            const { data: { opponentID } } = await fetchApi.get({ url: `/user-game/${userID}/request` });
            if(opponentID){
                const { data } = await fetchApi.get({ url: `/users/${opponentID}/user-info/` });
                dispatch({ type: SET_USER_GAME_REQUEST, payload: { userGameRequest: data } });
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        getUserGameRequest()
    }, [])


    return (
        <>
            <div className={styles.heading}>
                <h1>Lobby</h1>
                <img src="/icon/triangle.svg" width="25" height="25" />
            </div>
            {userGameRequest && (<>
                <div className={styles.waiting_opponent_container}>
                    <div>
                        <div className={styles.avatar} >
                            <img src={userGameRequest.picture || '/icon/default.webp'} />
                            <p> <strong> {userGameRequest.userName}</strong></p>
                        </div>
                        <h2>You&apos;re waiting the opponent to Join</h2>
                        <p>expired within 5 min if the opponent didn&apos;t join</p>
                    </div>
                    <Loading cirle />
                </div>
            </>)}
        </>
    )
}

export default WaitingOpponent
