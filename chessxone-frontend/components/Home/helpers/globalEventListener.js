import { membersSocket } from '../../../utils/socket-io-instance'
import {
    SESSION_SUCCESS,
    FRIEND_STATUS_CHANGED,
    USER_GAME_REQUEST_CANCLED,
    ADD_NEW_REQUEST_CONNECTION,
    ADD_NEW_FRIEND,
    ADD_NEW_USER_GAME_INVITATION,
    REMOVE_USER_GAME_REQUEST,
} from '../../../store/user/actions';
import { CONNECTION_UPDATE_EVENT, NEW_CONNECTION_EVENT, NEW_CONNECTION_REQUEST_EVENT, NEW_INCOMING_MATCH_REQUEST_EVENT, OUTGOING_MATCH_REQUEST_DECLINED_EVENT, SESSION_EVENT } from 'chessxone-shared/events';


const initiliseGlobalEventListners = (dispatch) => {
    membersSocket.on(SESSION_EVENT, () => {
        dispatch({ type: SESSION_SUCCESS })
    })

    membersSocket.on(CONNECTION_UPDATE_EVENT, (data) => {
        dispatch({ type: FRIEND_STATUS_CHANGED, payload: data })
    })

    // membersSocket.on('request_game_cancled', async (data) => {
    //     //TODO
    //     dispatch({ type: USER_GAME_REQUEST_CANCLED, payload: data })
    // })

    membersSocket.on(OUTGOING_MATCH_REQUEST_DECLINED_EVENT,()=>{
        dispatch({type: REMOVE_USER_GAME_REQUEST});
    })

    membersSocket.on(NEW_CONNECTION_REQUEST_EVENT, async (data) => {
        dispatch({ type: ADD_NEW_REQUEST_CONNECTION, payload: data })
    })

    membersSocket.on(NEW_INCOMING_MATCH_REQUEST_EVENT, async (data) => {
        dispatch({ type: ADD_NEW_USER_GAME_INVITATION, payload: data })
    })

    membersSocket.on(NEW_CONNECTION_EVENT, async (data) => {
        dispatch({ type: ADD_NEW_FRIEND, payload: data })
    })

}
export default initiliseGlobalEventListners;