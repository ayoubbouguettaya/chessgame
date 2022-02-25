import { useContext, useState,useEffect } from 'react'

import { userContext } from '../../../store/user/context'
import apiFetch from '../../../utils/apiFetch'
import styles from '../home.module.css'
import { USER_GAME_REQUEST_SUCCESS, SET_CONNECTED_FRIEND } from '../../../store/user/actions'

const OnlineFriends = () => {
    const { dispatch, state: { outGoingMatchRequest, userGameInvitations, connectedFriends, user: { _id: userID } } } = useContext(userContext)
    const [isLoadingData,setIsLoadingData] = useState(false);

    const handleInviteFriendSuccess = (friendData) => {
        dispatch({ type: USER_GAME_REQUEST_SUCCESS, payload: friendData })
    }

    useEffect(()=> {
        fetchOnlineConnections();
    },[]);

    const fetchOnlineConnections = async () => {
        try {
            setIsLoadingData(true)
            const { data } = await apiFetch.get({ url: `/users/${userID}/connection/online` })
            console.log(data)
            dispatch({ type: SET_CONNECTED_FRIEND, payload: { connectedFriends: data } })
        } catch (error) {

        }finally{
            setIsLoadingData(false)
        }
    }
    return (
        <>
            <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                <div className={styles.heading}>
                    <p><small> Online Friends ({connectedFriends ? connectedFriends.length : '0'})</small> </p>
                </div>
                <button disabled={isLoadingData} onClick={fetchOnlineConnections}>
                    {!isLoadingData ? (<img src="/icon/rotate.svg" height="15" width="15" />) : ('...')}
                </button>
            </div>
            <ul className={`${styles.online_friends_list} ${isLoadingData && styles.is_loading}`}>
                {connectedFriends && connectedFriends.map((friendData) => (
                    <li key={friendData._id}>
                        <div className={styles.item}>
                            <div className={styles.avatar}>
                                <img referrerPolicy="no-referrer" src={friendData.picture || '/icon/default.webp'} />
                                <span style={{ backgroundColor: friendData.isConnected ? 'green' : 'red' }} > </span>
                            </div>
                            <div>
                                <p> {friendData.userName}</p>
                                <FriendStatus
                                    userID={userID}
                                    handleInviteFriendSuccess={() => handleInviteFriendSuccess(friendData)}
                                    friendID={friendData._id}
                                    isPlaying={friendData.isPlaying}
                                    isLocked={friendData.isLocked}
                                    alreadyRequested={outGoingMatchRequest && outGoingMatchRequest._id === friendData._id}
                                    isRequesting={userGameInvitations.includes(friendData._id)}
                                />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default OnlineFriends


const FriendStatus = ({ handleInviteFriendSuccess, userID, friendID, isPlaying, isLocked, isRequesting, alreadyRequested }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleInviteFriend = async (friendID) => {
        try {
            setIsLoading(true)
            await apiFetch.put({ url: `/matchs/${userID}/request`, data: { userID: friendID } });
            handleInviteFriendSuccess()
        } catch (error) {

        }
        finally {
            setIsLoading(false)
        }
    }
    return (
        !isLocked && !isPlaying ? (
            <>
                {alreadyRequested ? (
                    <button className={styles.secondary}>Requested</button>
                ) : (
                        <button
                            className={styles.secondary}
                            onClick={() => handleInviteFriend(friendID)}
                            disabled={isLoading}
                        >
                            Play
                            {isLoading && (<img src="/icon/loader.svg" />)}
                        </button>
                    )}
            </>
        ) : (
                <div style={{ display: 'flex' }}>
                    {!isLocked ? (
                        <>
                            <img src="/icon/gamepad.png" height="25" width="25" />
                            <p><small> is playing</small></p>
                        </>
                    ) : (
                            <>
                                <img src="/icon/lock.svg" height="18" width="18" />
                                <p><small>{isRequesting ? 'Request you' : 'Not available'} </small></p>
                            </>
                        )}
                </div>
            )
    )
}
