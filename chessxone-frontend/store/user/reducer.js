import {
    FETCH_USER_SUCCESS,
    MUST_SIGNUP,
    MUST_LOGIN,
    LOGOUT,
    ERROR,
    LOADING,
    DONE,

    SET_CONNECTED_FRIEND,
    SET_OUTGOING_MATCH_REQUEST,
    SET_INCOMING_MATCH_REQUESS,
    SET_CONNECTIONS_REQUEST,

    FRIEND_STATUS_CHANGED,
    REQUEST_CONNECTION_SUCCESS,
    ADD_NEW_REQUEST_CONNECTION,
    ADD_NEW_FRIEND,

    ADD_NEW_INCOMING_MATCH_REQUES,
    USER_GAME_REQUEST_SUCCESS,
    NEW_GAME_READY,

    CLEAR_TAB_NOTIFICATION,
    REMOVE_OUTGOING_MATCH_REQUEST,
    REMOVE_INCOMING_MATCH_REQUES,
    SESSION_SUCCESS
} from './actions';

const globalReducer = (state, action) => {
    switch (action.type) {
        case FETCH_USER_SUCCESS: {
            const { user } = action.payload;
            return { ...state, user, hasSignedUp: true, hasLoggedIn: true };
        }
        case MUST_SIGNUP: {
            return { ...state, user: null, hasSignedUp: false, hasLoggedIn: true };
        }
        case MUST_LOGIN: {
            return { ...state, user: null, hasSignedUp: false, hasLoggedIn: false };
        }
        case LOGOUT: {
            return { ...state, user: null, hasSignedUp: false, hasLoggedIn: false };
        }
        case LOADING: {
            return { ...state, isLoading: true, error: null }
        }
        case DONE: {
            return { ...state, isLoading: false }
        }
        case ERROR: {
            const { code, message } = action.payload;
            return { ...state, error: { code, message } };
        }

        case SESSION_SUCCESS : {
            return {...state, isConnected: true}
        }
        case SET_CONNECTED_FRIEND: {
            const { connectedFriends } = action.payload;
            return { ...state, connectedFriends }
        }

        case SET_OUTGOING_MATCH_REQUEST: {
            const { outGoingMatchRequest } = action.payload;

            return { ...state, outGoingMatchRequest }
        }

        case SET_INCOMING_MATCH_REQUESS: {
            const { inComingMatchRequests } = action.payload;

            return { ...state, inComingMatchRequests }
        }

        case SET_CONNECTIONS_REQUEST: {
            const { outgoingRequests, incomingRequests } = action.payload;
            return { ...state, user: { ...state.user, outgoingRequests, incomingRequests } }
        }

        case FRIEND_STATUS_CHANGED: {
            const { connectedFriends, notificationTab } = state;
            const { _id: userID,
                userName,
                tagID,
                picture,
                isConnected,
                isLocked,
                isPlaying,
            } = action.payload;

            notificationTab.push('FRIEND')

            const index = connectedFriends ? connectedFriends.findIndex((ele) => (ele._id === userID)) : -1;
            if (index !== -1) {
                connectedFriends[index].isConnected = isConnected;
                if (isConnected) {
                    connectedFriends[index].isLocked = isLocked;
                    connectedFriends[index].isPlaying = isPlaying;
                } else {
                    connectedFriends[index].isLocked = true;
                }

                return { ...state, connectedFriends: [...connectedFriends] };
            }

            connectedFriends.push({ _id: userID, userName, tagID, picture, isConnected, isPlaying, isLocked })

            return {
                ...state,
                connectedFriends: [...connectedFriends],
                notificationTab: [...notificationTab]
            }
        }

        case USER_GAME_REQUEST_SUCCESS: {
            const { _id, userName, picture, tagID } = action.payload;
            const newOutGoingMatchRequest = { _id, userName, picture, tagID ,issuedXXSecondsAgo: 1};
            const { notificationTab } = state;
            notificationTab.push('LOBBY')
            return { ...state, outGoingMatchRequest: newOutGoingMatchRequest, notificationTab: [...notificationTab] }
        }

        case ADD_NEW_INCOMING_MATCH_REQUES: {
            const { _id } = action.payload;
            const { inComingMatchRequests, connectedFriends, notificationTab } = state;
            notificationTab.push('LOBBY')

            if (!inComingMatchRequests.includes(_id)) {
                inComingMatchRequests.push(_id);
            }
            /* */
            const index = connectedFriends ? connectedFriends.findIndex((ele) => (ele._id === _id)) : -1;
            if (index !== -1) {
                connectedFriends[index].isLocked = true;
            }
            /* */
            return {
                ...state,
                inComingMatchRequests: [...inComingMatchRequests],
                connectedFriends: [...connectedFriends],
                notificationTab: [...notificationTab]
            }
        }

        case REQUEST_CONNECTION_SUCCESS: {
            const { _id, picture, tagID, userName } = action.payload;
            const { user, user: { outgoingRequests }, notificationTab } = state;
            outgoingRequests.push({ _id, picture, tagID, userName });
            notificationTab.push('CONNECTION')

            return {
                ...state,
                user: { ...user, outgoingRequests },
                notificationTab: [...notificationTab]
            };
        }

        case ADD_NEW_REQUEST_CONNECTION: {
            const { _id, picture, tagID, userName } = action.payload;
            const { user, user: { incomingRequests }, notificationTab } = state;
            notificationTab.push('CONNECTION')

            const index = incomingRequests ? incomingRequests.findIndex((ele) => (ele._id === _id)) : -1;
           console.log(incomingRequests,index)
            if (index === -1) {
                incomingRequests.push({ _id, picture, tagID, userName });
            }

            return {
                ...state,
                user: { ...user, incomingRequests: [...incomingRequests] },
                notificationTab: [...notificationTab]
            };
        }

        case ADD_NEW_FRIEND: {
            const { _id, userName, tagID, picture, isLocked = false, isPlaying = false, isConnected = false } = action.payload;
            const { user, user: { incomingRequests, outgoingRequests }, connectedFriends, notificationTab } = state;
            notificationTab.push('FRIEND')

            const friendFound = connectedFriends ? connectedFriends.findIndex((ele) => (ele._id === _id)) : -1;
            if (friendFound === -1) {
                connectedFriends.push({ _id, userName, tagID, picture, isLocked, isPlaying, isConnected })
            }

            const index = incomingRequests ? incomingRequests.findIndex(ele => (ele)._id === _id) : -1;
            if (index !== -1) {
                incomingRequests.splice(index, 1)
            }

            const index2 = outgoingRequests ? outgoingRequests.findIndex(ele => (ele)._id === _id) : -1;
            if (index2 !== -1) {
                outgoingRequests.splice(index2, 1)
            }

            return {
                ...state,
                connectedFriends: [...connectedFriends],
                user: { ...user, incomingRequests, outgoingRequests },
                notificationTab: [...notificationTab]
            };
        }

        case NEW_GAME_READY: {
            const { notificationTab } = state;
            notificationTab.push('LOBBY')

            return {
                ...state,
                notificationTab: [...notificationTab],
                outGoingMatchRequest: null,
                inComingMatchRequests: []
            }
        }

        case REMOVE_OUTGOING_MATCH_REQUEST: {
            return { ...state, outGoingMatchRequest: undefined }
        }

        case REMOVE_INCOMING_MATCH_REQUES: {
            const { _id } = action.payload;
            const { inComingMatchRequests, connectedFriends } = state;

            let newInComingMatchRequests = new Set(inComingMatchRequests);

            if (inComingMatchRequests.includes(_id)) {
                newInComingMatchRequests.delete(_id);
            }
            /* */
            const index = connectedFriends ? connectedFriends.findIndex((ele) => (ele._id === _id)) : -1;
            if (index !== -1) {
                connectedFriends[index].isLocked = false;
            }
            /* */
            return {
                ...state,
                inComingMatchRequests: [...newInComingMatchRequests],
                connectedFriends: [...connectedFriends],
            }
        }

        case CLEAR_TAB_NOTIFICATION: {
            const { notificationTab } = state;
            const { Event } = action.payload;

            const newNotificationTab =  notificationTab.filter((ele) => ele !== Event)

            return { ...state, notificationTab: [...newNotificationTab] }
        }

        default:
            return state;
    }
}

export default globalReducer;