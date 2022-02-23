import React, { useEffect, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import AddFriend from './helpers/AddFriend';
import FriendInvitation from './helpers/FriendInvitation';
import IdLabelCopy from './helpers/IdLabelCopy';
import OnlineFriends from './helpers/OnlineFriends';
import WaitingOpponent from './helpers/WaitingOpponent';
import JoinGameRequesting from './helpers/JoinGameRequesting';
import Browse from './helpers/Browse';

import Skeleton from '../UI/Skeleton';
import BackgroundLogo from '../UI/BackgroundLogo';
import styles from './home.module.css';

import { userContext } from '../../store/user/context'
import initiliseGlobalEventListners from './helpers/globalEventListener';
import { membersSocket } from '../../utils/socket-io-instance';
import {
    NEW_GAME_READY,
    CLEAR_TAB_NOTIFICATION
} from '../../store/user/actions';

import {BLACK} from 'chessxone-shared/constants'
import { NEW_GAME_READY_EVENT } from 'chessxone-shared/events';

const LOBBY = 'LOBBY';
const CONNECTION = 'CONNECTION';
const FRIEND = 'FRIEND';

const HomeComponent = () => {
    const { dispatch, state: { user: { tagID, _id: userID = '' }, notificationTab } } = useContext(userContext);
    const router = useRouter()
    const [panelToDisplay, setPanelToDisplay] = useState(LOBBY);

    useEffect(() => {
        initiliseGlobalEventListners(dispatch)
        
        console.log(BLACK)

    }, [])

    const handleClearTabNotifacation = (Event) => {
        dispatch({ type: CLEAR_TAB_NOTIFICATION, payload: { Event } })
    }

    useEffect(() => {
        membersSocket.on(NEW_GAME_READY_EVENT, async ({ gameID }) => {
            if (gameID) {
                router.replace(`/game/${gameID}`)
                dispatch({ type: NEW_GAME_READY })
            }
        })
    }, [])

    return (
        <div className={styles.home_container}>
            <NavigationTab
                handleClearTabNotifacation={handleClearTabNotifacation}
                notificationTab={notificationTab}
                panelToDisplay={panelToDisplay}
                setPanelToDisplay={setPanelToDisplay} />
            <div className={`${styles.sidebar_container} ${panelToDisplay === CONNECTION ? styles.display : ''}`}>
                <AddFriend />
                <FriendInvitation />
            </div>
            <div className={`${styles.center_container} ${panelToDisplay === LOBBY ? styles.display : ''}`}>
                <div>
                    <div className={styles.heading}>
                        <h1>Lobby</h1>
                        <img src="/icon/triangle.svg" width="25" height="25" />
                    </div>
                    <WaitingOpponent />
                    <JoinGameRequesting />
                </div>
                <Browse userID={userID} />
            </div>
            <div className={`${styles.sidebar_container} ${panelToDisplay === FRIEND ? styles.display : ''}`}>
                <IdLabelCopy playerID={`#${tagID}` || '#000000'} />
                <OnlineFriends />
            </div>
        </div>
    )
}

export default HomeComponent

export const HomeSkeleton = () => (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <div style={{ width: '20%' }}>
            <Skeleton width="200px" height="calc(100vh - 60px)" marginTop="10px" >

            </Skeleton>
        </div>
        <div style={{ width: '80%', height: "calc(100vh - 60px)" }}>
            <BackgroundLogo hideButton />
        </div>
    </div>
)

const NavigationTab = ({ handleClearTabNotifacation, notificationTab, panelToDisplay, setPanelToDisplay }) => {
    return (
        <div className={styles.navigation_mobile}>
            <button
                className={`${panelToDisplay === LOBBY ? styles.active_tab : ''}`}
                onClick={() => { handleClearTabNotifacation(LOBBY); setPanelToDisplay(LOBBY) }}>
                <img src="/icon/zap.svg" />
                {notificationTab.includes(LOBBY) && (<span>1</span>)}
            </button>
            <button
                className={`${panelToDisplay === CONNECTION ? styles.active_tab : ''}`}
                onClick={() => { handleClearTabNotifacation(CONNECTION); setPanelToDisplay(CONNECTION) }} >
                <img src="/icon/inbox.svg" />
                {notificationTab.includes(CONNECTION) && (<span>1</span>)}

            </button>
            <button
                className={`${panelToDisplay === FRIEND ? styles.active_tab : ''}`}
                onClick={() => { handleClearTabNotifacation(FRIEND); setPanelToDisplay(FRIEND) }} >
                <img src="/icon/users.svg" />
                {notificationTab.includes(FRIEND) && (<span>1</span>)}

            </button>
        </div>
    )
}