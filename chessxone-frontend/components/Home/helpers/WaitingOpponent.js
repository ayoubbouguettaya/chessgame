import React, { useContext, useState, useEffect } from 'react'

import styles from '../home.module.css';
import Loading from '../../UI/Loading';
import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import { SET_USER_GAME_REQUEST } from '../../../store/user/actions';
import useCounterDisplay from '../../hook/useCounterDisplay';

const WaitingOpponent = () => {
    const { dispatch, state: { user: { _id: userID }, userGameRequest } } = useContext(userContext);
    const { count, display, startCount } = useCounterDisplay(10);


    const getUserGameRequest = async () => {
        try {
            const { data: { opponentID, issuedXXSecondsAgo = 0 } } = await fetchApi.get({ url: `/match/${userID}/request` });
            startCount(issuedXXSecondsAgo)
            if (opponentID) {
                const { data } = await fetchApi.get({ url: `/users/${opponentID}` });
                dispatch({ type: SET_USER_GAME_REQUEST, payload: { userGameRequest: { ...data, issuedXXSecondsAgo } } });
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        if (userGameRequest) {
            startCount(userGameRequest.issuedXXSecondsAgo)
        }
    }, [userGameRequest])

    useEffect(() => {
        getUserGameRequest()
    }, [])


    return (
        <>
            {userGameRequest && (<>
                <div className={styles.waiting_opponent_container}>
                    <div>
                        <div className={styles.user_container}>
                            <div className={styles.avatar} >
                                <img src={userGameRequest.picture || '/icon/default.webp'} />
                            </div>
                            <p >
                                <strong> {userGameRequest.userName}</strong>
                                <span className={styles.small}> #{userGameRequest.tagID} </span>
                            </p>
                        </div>
                        <h2>You&apos;re waiting the opponent to Join <span className={styles.small}>({display}) </span> </h2>
                    </div>
                    <Loading cirle />
                </div>
            </>)}
        </>
    )
}

export default WaitingOpponent
