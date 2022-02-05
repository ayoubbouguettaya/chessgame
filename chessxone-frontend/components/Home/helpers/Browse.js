import React, { useEffect, useState, useContext } from 'react'

import styles from '../home.module.css';
import fetchApi from '../../../utils/apiFetch'
import Skeleton from '../../UI/Skeleton';
import { userContext } from '../../../store/user/context';
import { USER_GAME_REQUEST_SUCCESS } from '../../../store/user/actions';

const Browse = ({ userID }) => {
    const [suggestedUsersId, setSuggestedUsersId] = useState([]);
    const {
        dispatch,
        state: {
            userGameRequest,
            userGameInvitations,
            connectedFriends,
        } } = useContext(userContext);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data: lastConnectedUsers } = await fetchApi.get({ url: `/users/${userID}/feed` })

                setSuggestedUsersId(
                    lastConnectedUsers.filter(
                        (connectionID) =>
                            connectionID !== userID &&
                            !userGameInvitations.includes(connectionID)
                    ))

            } catch (error) {
            }
        }

        fetchFeed()
    }, [userGameInvitations])


    const handleRequestGame = async (playerID) => {
        try {
            await fetchApi.put({ url: `/user-game/${userID}/request`, data: { userID: playerID } });
            setSuggestedUsersId(suggestedUsersId.filter((suggestedplayerID) => suggestedplayerID !== playerID))
        } catch (error) {
            throw new Error('request game failed')
        }

    }

    const handleRequestGameSuccess = (opponentData) => {
        dispatch({ type: USER_GAME_REQUEST_SUCCESS, payload: opponentData });

    }

    /* 
    if a user has invite a player and he is waiting for response
     he can't invite another player similtusly
    */

    if (userGameRequest) {
        return (<div />)
    }

    return (
        <div className={styles.suggested_player_container}>
            <ul>
                {suggestedUsersId.map((ele) => (
                    <ConnectionItem
                        key={ele}
                        handleRequestGame={handleRequestGame}
                        userID={ele}
                        isFriend={connectedFriends.some((friend) => friend._id === ele)}
                        handleRequestGameSuccess={handleRequestGameSuccess} />
                ))}
            </ul>
        </div>
    )
}

export default Browse


const ConnectionItem = ({ userID, isFriend, handleRequestGame, handleRequestGameSuccess }) => {
    const [userInfo, setuserInfo] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [isRequesting, setIsRequesting] = useState(false)

    const getuserInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await fetchApi.get({ url: `/users/${userID}/user-info` })
            setuserInfo(data)
        } catch (error) {
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getuserInfo()
    }, [])

    if (isLoading || !userInfo) {
        return (<li><Skeleton width="180px" height="135px" /></li>)
    }

    const requestGame = async () => {
        try {
            setIsRequesting(true)
            await handleRequestGame(userID)
            handleRequestGameSuccess(userInfo)
        } catch (error) {
        }
        finally {
            setIsRequesting(false)
        }
    }

    return (
        <li>
            <div style={{ display: "flex", alignItems: 'center' }}>
                <span className={styles.avatar}>
                    <img src={userInfo.picture} />
                </span>
                <p >
                    {userInfo.userName}
                    <span className={styles.small}> #{userInfo.tagID}</span>
                </p>
            </div>
            <div className={styles.footer}>
                <div>
                    {!userInfo.isPlaying && <img src="/icon/zap.svg" height="20" width="20" />}
                    {isFriend && (<img src="/icon/users.svg" height="20" width="20" />)}
                </div>
                <button
                    disabled={isRequesting}
                    onClick={requestGame}
                    className={styles.secondary}>
                    {!isRequesting && 'Invite'}
                    {isRequesting && <img src="/icon/loader.svg" height="15" width="15" />}
                </button>
            </div>
        </li>
    )
}