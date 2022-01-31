import React, { useEffect, useState, useContext } from 'react'

import styles from '../home.module.css';
import fetchApi from '../../../utils/apiFetch'
import Skeleton from '../../UI/Skeleton';
import { userContext } from '../../../store/user/context';
import { USER_GAME_REQUEST_SUCCESS } from '../../../store/user/actions';

const Browse = ({ userID }) => {
    const [suggestedUsersId, setSuggestedUsersId] = useState([])
    const { dispatch, state: { user: { incomingRequests = [], outgoingRequests = [] },connectedFriends } } = useContext(userContext);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data } = await fetchApi.get({ url: `/users/${userID}/feed` })
                const { lastConnectedUsers, connections } = data;
                // we will no longer filter By Non connection based to suggest player.
                // let filtredList = lastConnectedUsers.filter((ele) => !connections.includes(ele))
                // setSuggestedUsersId(filtredList.filter((connectionID) => connectionID !== userID))
                setSuggestedUsersId(lastConnectedUsers.filter((connectionID) => connectionID !== userID))
            } catch (error) {
            }
        }
        fetchFeed()
    }, [])

    /* TO DELETE */
    /* Filtring suggested player with be BY UserGameRequest UserGameInvitations */
    // useEffect(() => {
    //     setSuggestedUsersId(suggestedUsersId.filter((connectionID) => connectedFriends.findIndex((ele) => (ele._id === connectionID)) === -1))
    // },[connectedFriends])

    // useEffect(() => {
    //     setSuggestedUsersId(suggestedUsersId.filter((connectionID) => incomingRequests.findIndex((ele) => (ele._id === connectionID)) === -1))
    // },[incomingRequests])

    // useEffect(() => {
    //     setSuggestedUsersId(suggestedUsersId.filter((connectionID) => outgoingRequests.findIndex((ele) => (ele._id === connectionID)) === -1))
    // },[outgoingRequests])

    /* 
    -----------------------------
    instead of requesting connection
    the player will ask for a match
    once the players are matched and start playing 
    they will be able to request a connection
    -------------------------------
    
    const handleRequestConnection = async (friendID) => {
        try {
            await fetchApi.post({ url: `/users/${userID}/connection/requests`, data: { userID: friendID } })
            setSuggestedUsersId(suggestedUsersId.filter((connectionID) => connectionID !== friendID))
        } catch (error) {
            console.log(error)
        }
    }
    */

    const handleRequestGame = async (playerID) => {
        try {
            await fetchApi.put({ url: `/user-game/${userID}/request`, data: { userID: playerID } });
            setSuggestedUsersId(suggestedUsersId.filter((suggestedplayerID) => suggestedplayerID !== playerID))
        } catch (error) {
            throw  new Error('request game failed')
        }

    }

    const handleRequestGameSuccess = (opponentData) => {
        dispatch({ type: USER_GAME_REQUEST_SUCCESS, payload: opponentData });

    }

    return (
        <div className={styles.suggested_player_container}>
            <p style={{color: 'var(--purple)'}}>suggested Players</p>
            <ul>
                {suggestedUsersId.map((ele) => (
                    <ConnectionItem 
                    key={ele}
                     handleRequestGame={handleRequestGame}
                      userID={ele}
                      handleRequestGameSuccess={handleRequestGameSuccess} />
                ))}
            </ul>
        </div>
    )
}

export default Browse


const ConnectionItem = ({ userID, handleRequestGame,handleRequestGameSuccess }) => {
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
        return (<li><Skeleton width="200px" height="160px" /></li>)
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
                <p>  {userInfo.userName} </p>
            </div>
            <div>
                <button
                    disabled={isRequesting}
                    onClick={requestGame}
                    className={styles.secondary}>
                    {!isRequesting && 'Play'}
                    {isRequesting && <img src="/icon/loader.svg" height="15" width="15" />}
                </button>

            </div>
        </li>
    )
}