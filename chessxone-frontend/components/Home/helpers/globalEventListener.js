import { membersSocket } from '../../../utils/socket-io-instance'
import {
    SET_CONNECTED_FRIEND,
    FRIEND_STATUS_CHANGED,
    USER_GAME_REQUEST_CANCLED,
    ADD_NEW_REQUEST_CONNECTION,
    ADD_NEW_FRIEND,
    ADD_NEW_USER_GAME_INVITATION,
} from '../../../store/user/actions';


const initiliseGlobalEventListners = (dispatch) => {
    membersSocket.on('session', ({ connectedFriends }) => {
        dispatch({ type: SET_CONNECTED_FRIEND, payload: { connectedFriends } })
    })

    membersSocket.on('friend_changed_status', (data) => {
        dispatch({ type: FRIEND_STATUS_CHANGED, payload: data })
    })

    membersSocket.on('request_game_cancled', async (data) => {
        //TODO
        dispatch({ type: USER_GAME_REQUEST_CANCLED, payload: data })
    })

    membersSocket.on('add_new_connection_request', async (data) => {
        dispatch({ type: ADD_NEW_REQUEST_CONNECTION, payload: data })
    })

    membersSocket.on('add_new_user_game_invitation', async (data) => {
        dispatch({ type: ADD_NEW_USER_GAME_INVITATION, payload: data })
    })

    membersSocket.on("add_new_friend", async (data) => {
        dispatch({ type: ADD_NEW_FRIEND, payload: data })
    })

}
export default initiliseGlobalEventListners;