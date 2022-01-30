import React, { useState, useEffect, useContext } from 'react';

import styles from '../home.module.css'

import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import Skeleton from '../../UI/Skeleton';
import { SET_USER_GAME_INVITATIONS } from '../../../store/user/actions';

const JoinGameRequesting = () => {
    const { dispatch, state: { user: { _id: userID }, userGameInvitations } } = useContext(userContext);

    const getUserGameInvitations = async () => {
        try {
            const { data } = await fetchApi.get({ url: `/user-game/${userID}/invitations` })
            dispatch({ type: SET_USER_GAME_INVITATIONS, payload: { userGameInvitations: data } })
        } catch (error) {
            throw new Error('get games invitations failed')
        }finally{
            return;
        }
    }

    const joinGame = async (friendID) => {
        try {
            await fetchApi.put({ url: `/user-game/${userID}/accept`, data: { userID: friendID } });
        } catch (error) {
            throw new Error('join game failed')
        }finally{
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
                        <FriendRequestingItem joinGame={() => { joinGame(opponentID) }} key={opponentID} opponentID={opponentID}
                        />))}
            </ul>
        </div>
    )
}

export default JoinGameRequesting


const FriendRequestingItem = ({ opponentID, joinGame, message = '' }) => {
    const [friendInfo, setFriendInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false);

    const getFriendInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await fetchApi.get({ url: `/users/${opponentID}/user-info/` })
            setFriendInfo(data)
        } catch (error) {
            
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(async () => {
        await getFriendInfo()
    }, [])

    if (isLoading || !friendInfo) {
        
        return (<li><Skeleton width="100%" height="160px" /></li>)
    }

    return (
        <li>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <span className={styles.avatar}>
                    <img src={friendInfo.picture || `/icon/default.webp`} />
                </span>
                <p>  {friendInfo.userName} </p>
            </div>
            <p>{message ? message : 'is Requesting you to join a game'}</p>
            <div>
                <button onClick={joinGame} className={styles.secondary}>accept</button>
            </div>
        </li>
    )
}