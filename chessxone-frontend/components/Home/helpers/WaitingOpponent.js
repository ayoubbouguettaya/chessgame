import React, { useContext, useState, useEffect } from 'react'

import styles from '../home.module.css';
import Loading from '../../UI/Loading';
import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import { SET_OUTGOING_MATCH_REQUEST } from '../../../store/user/actions';
import useCounterDisplay from '../../hook/useCounterDisplay';

const WaitingOpponent = () => {
    const { dispatch, state: { user: { _id: userID }, outGoingMatchRequest } } = useContext(userContext);
    const { count, display, startCount } = useCounterDisplay(10);


    const getOutGoingMatchRequest = async () => {
        try {
            const { data: { opponentID, issuedXXSecondsAgo = 0 } } = await fetchApi.get({ url: `/matchs/${userID}/outgoing` });
            startCount(issuedXXSecondsAgo)
            if (opponentID) {
                const { data } = await fetchApi.get({ url: `/users/${opponentID}` });
                dispatch({ type: SET_OUTGOING_MATCH_REQUEST, payload: { outGoingMatchRequest: { ...data, issuedXXSecondsAgo } } });
            }
        } catch (error) {
        }
    }

    useEffect(() => {
        if (outGoingMatchRequest) {
            startCount(outGoingMatchRequest.issuedXXSecondsAgo)
        }
    }, [outGoingMatchRequest])

    useEffect(() => {
        getOutGoingMatchRequest()
    }, [])


    return (
        <>
            {outGoingMatchRequest && (<>
                <div className={styles.waiting_opponent_container}>
                    <div>
                        <div className={styles.user_container}>
                            <div className={styles.avatar} >
                                <img src={outGoingMatchRequest.picture || '/icon/default.webp'} />
                            </div>
                            <p >
                                <strong> {outGoingMatchRequest.userName}</strong>
                                <span className={styles.small}> #{outGoingMatchRequest.tagID} </span>
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
