import React, { useEffect, useState, useContext } from 'react'

import styles from '../home.module.css';
import fetchApi from '../../../utils/apiFetch'
import Skeleton from '../../UI/Skeleton';
import { userContext } from '../../../store/user/context';

const Browse = ({ userID }) => {
    const [suggestedUsersId, setSuggestedUsersId] = useState([])
    const { state: { user: { incomingRequests = [], outgoingRequests = [] },connectedFriends } } = useContext(userContext);

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const { data } = await fetchApi.get({ url: `/users/${userID}/feed` })
                const { lastConnectedUsers, connections } = data;

                let filtredList = lastConnectedUsers.filter((ele) => !connections.includes(ele))
                setSuggestedUsersId(filtredList.filter((connectionID) => connectionID !== userID))
            } catch (error) {
            }
        }
        fetchFeed()
    }, [])

    useEffect(() => {
        setSuggestedUsersId(suggestedUsersId.filter((connectionID) => connectedFriends.findIndex((ele) => (ele._id === connectionID)) === -1))
    },[connectedFriends])

    useEffect(() => {
        setSuggestedUsersId(suggestedUsersId.filter((connectionID) => incomingRequests.findIndex((ele) => (ele._id === connectionID)) === -1))
    },[incomingRequests])

    useEffect(() => {
        setSuggestedUsersId(suggestedUsersId.filter((connectionID) => outgoingRequests.findIndex((ele) => (ele._id === connectionID)) === -1))
    },[outgoingRequests])

    const handleRequestConnection = async (friendID) => {
        try {
            await fetchApi.post({ url: `/users/${userID}/connection/requests`, data: { userID: friendID } })
            setSuggestedUsersId(suggestedUsersId.filter((connectionID) => connectionID !== friendID))
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className={styles.suggested_player_container}>
            <p style={{color: 'var(--purple)'}}>suggested Players</p>
            <ul>
                {suggestedUsersId.map((ele) => (
                    <ConnectionItem key={ele} handleRequestConnection={handleRequestConnection} userID={ele} />
                ))}
            </ul>
        </div>
    )
}

export default Browse


const ConnectionItem = ({ userID, handleRequestConnection }) => {
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

    const requestConnection = async () => {
        try {
            setIsRequesting(true)
            console.log('request connection')
            await handleRequestConnection(userID)
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
                    onClick={requestConnection}
                    className={styles.secondary}>
                    Request{isRequesting && 'ed'}
                    {isRequesting && <img src="/icon/loader.svg" height="15" width="15" />}
                </button>

            </div>
        </li>
    )
}