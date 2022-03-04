import React, { useEffect, useState, useContext } from 'react'

import styles from '../home.module.css';
import fetchApi from '../../../utils/apiFetch';
import { userContext } from '../../../store/user/context';
import Loading from '../../UI/Loading';
import { SET_CONNECTIONS_REQUEST,REQUEST_CONNECTION_SUCCESS } from '../../../store/user/actions';

const FriendInvitation = () => {
    const { dispatch,state: { user: { _id: userID  },incomingRequests ,outgoingRequests} } = useContext(userContext);

    const [activeTab, setActiveTab] = useState('REQUESTS_TAB')
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingApprove, setIsLoadingApprove] = useState(false);

    useEffect(()=>{
        getFriendInvitationInfo();
    },[])
    const getFriendInvitationInfo = async () => {
        try {
            setIsLoading(true)
            const { data } = await fetchApi.get({ url: `/users/${userID}/connections/requests` })
            dispatch({type: SET_CONNECTIONS_REQUEST,payload: data})
            
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const approveConnectionRequest = async (friendID) => {
        try {
            setIsLoadingApprove(true)
            await fetchApi.put({ url: `/users/${userID}/connection/approve`, data: { userID: friendID } })
            await getFriendInvitationInfo();
        } catch (error) {

        } finally {
            setIsLoadingApprove(false)
        }
    }

    return (
        <div className={styles.friend_invitation_container}>
            <div className={styles.tabs_container}>
                <button
                    onClick={() => setActiveTab('PENDING_TAB')}
                    className={`${styles.tab} ${activeTab === 'PENDING_TAB' ? styles.active : ''}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setActiveTab('REQUESTS_TAB')}
                    className={`${styles.tab} ${activeTab === 'REQUESTS_TAB' ? styles.active : ''}`}
                >
                    Request
                </button>
                <button disabled={isLoading} onClick={getFriendInvitationInfo} >
                    <img src="/icon/rotate.svg" height="15" width="15" />
                </button>
            </div>
            <div className={styles.tab_panel}>
                {isLoading ? (<div className={styles.loading_container}><Loading /></div>) : (
                    <>
                        {activeTab === 'REQUESTS_TAB' && (<IncomingRequestsPanel disableBtn={isLoadingApprove} handleApprove={approveConnectionRequest} data={incomingRequests} />)}
                        {activeTab === 'PENDING_TAB' && (<OutgoingRequests data={outgoingRequests} />)}
                    </>
                )}
            </div>
        </div>
    )
}

export default FriendInvitation

const IncomingRequestsPanel = ({ data = [], disableBtn, handleApprove }) => (
    <ul>
        {data.length > 0 ? data.map((friendToConnect) => (
            <li key={friendToConnect.userName} >
                <div className={styles.item}>
                    <div className={styles.avatar}>
                        <img src={friendToConnect.picture || '/icon/default.webp'} />
                    </div>
                    <p>  {friendToConnect.userName}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <small>#{friendToConnect.tagID}</small>
                    <button disabled={disableBtn} onClick={() => handleApprove(friendToConnect._id)} >Accept</button>
                </div>
            </li>
        )) : (
                <p>Nothing to show</p>
            )}
    </ul>
);

const OutgoingRequests = ({ data = [] }) => (
    data.length > 0 ? (
        <ul>
            {data.map((pendingRequest) => (
                <li key={pendingRequest}>{pendingRequest.userName}</li>
            ))}
        </ul>
    ) : (
            <p>Nothing to show</p>
        )
)