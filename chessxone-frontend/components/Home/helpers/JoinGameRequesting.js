import React, { useState, useEffect, useContext } from 'react';

import styles from '../home.module.css'

import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import Skeleton from '../../UI/Skeleton';
import { REMOVE_USER_GAME_INVITATION, SET_USER_GAME_INVITATIONS } from '../../../store/user/actions';
import useCounterDisplay from '../../hook/useCounterDisplay';

const JoinGameRequesting = () => {
    const { dispatch, state: { user: { _id: userID }, userGameInvitations } } = useContext(userContext);

    const getUserGameInvitations = async () => {
        try {
            const { data } = await fetchApi.get({ url: `/user-game/${userID}/invitations` })
            dispatch({ type: SET_USER_GAME_INVITATIONS, payload: { userGameInvitations: data } })
        } catch (error) {
            throw new Error('get games invitations failed')
        } finally {
            return;
        }
    }

    const joinGame = async (opponentID) => {
        try {
            await fetchApi.put({ url: `/user-game/${userID}/accept`, data: { userID: opponentID } });
        } catch (error) {
            if (error.response) {
                const { status } = error.response || 500;
                if (status === 403) {
                    await declineGame(opponentID)
                }
            }
            throw new Error('join game failed')
        } finally {
            return;
        }
    }

    const declineGame = async (opponentID) => {
        try {
            await fetchApi.put({ url: `/user-game/${userID}/decline`, data: { userID: opponentID } });
            dispatch({ type: REMOVE_USER_GAME_INVITATION, payload: { _id: opponentID } })
        } catch (error) {
            throw new Error('decline game failed')
        } finally {
            return;
        }
    }

    useEffect(() => {
        getUserGameInvitations()
    }, [])

    return (
        <div className={styles.game_request_container}>
            <ul>
                {userGameInvitations &&
                    userGameInvitations.map((opponentID) => (
                        <FriendRequestingItem
                            declineGame={() => declineGame(opponentID)}
                            joinGame={() => { joinGame(opponentID) }}
                            key={opponentID}
                            opponentID={opponentID}
                        />))}
            </ul>
        </div>
    )
}

export default JoinGameRequesting


const FriendRequestingItem = ({ opponentID, joinGame, declineGame }) => {
    const [friendInfo, setFriendInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const { count, display, startCount } = useCounterDisplay(10);

    const [isJoinLoading, setIsJoinLoading] = useState(false);
    const [isDeclineLoading, setIsDeclineLoading] = useState(false)

    const handleJoinGame = async () => {
        setIsJoinLoading(true)
        await joinGame()
        setIsJoinLoading(false)
    }

    const handleDeclineGame = async () => {
        setIsDeclineLoading(true)
        await declineGame(); 
        setIsDeclineLoading(false)
    }


    const getFriendInfo = async () => {
        try {
            setIsLoading(true);
            const { data: { opponentID: myID, issuedXXSecondsAgo = 0 } } = await fetchApi.get({ url: `/user-game/${opponentID}/request` });
            startCount(issuedXXSecondsAgo);
            const { data } = await fetchApi.get({ url: `/users/${opponentID}` })
            setFriendInfo(data)
        } catch (error) {
            if (error.response) {
                const { status } = error.response || 500;
                if (status === 404) {
                    declineGame(opponentID)
                }
            }
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(async () => {
        await getFriendInfo()
    }, [])

    if (isLoading || !friendInfo) {

        return (<li><Skeleton width="100%" height="70px" /></li>)
    }

    return (
        <li>
            <div className={styles.user_container}>
                <span className={styles.avatar}>
                    <img src={friendInfo.picture || `/icon/default.webp`} />
                </span>
                <p >
                    {friendInfo.userName}
                    <span className={styles.small}> #{friendInfo.tagID}</span>
                </p>
            </div>
            <p>Requesting you to join a game<span className={styles.small}> ({display})</span></p>
            <div>
                <button
                    disabled={isDeclineLoading || isJoinLoading}
                    onClick={handleJoinGame}
                    className={styles.secondary}>
                    Accept
                    {isJoinLoading && <img src="/icon/loader.svg" height="15" width="15" />}
                </button>
                <button
                    disabled={isDeclineLoading || isJoinLoading}
                    onClick={handleDeclineGame}
                    style={{ color: 'var(--purple)' }}>
                    {isDeclineLoading ? <img src="/icon/loader.svg" height="15" width="15" /> : 'Decline'}
                </button>
            </div>
        </li>
    )
}