import { createContext, useMemo, useReducer,useEffect } from 'react'

import reducer from './reducer';
import fetchUser from '../../utils/fetchUser';

const initialValues = {
    user: { _id: undefined},
    outgoingRequests: [],
    incomingRequests: [],
    connectedFriends: [],
    inComingMatchRequests: [],
    outGoingMatchRequest: null,
    hasSignedUp: false,
    hasLoggedIn: false,
    isLoading: true,
    isConnected: false,
    notificationTab: [],
    error: null
}

const userContext = createContext({})
const { Provider } = userContext;

const UserContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer,initialValues);

    useEffect(() => {
        fetchUser(dispatch);
    }, []);


    const contextValue = useMemo(() => ({ dispatch, state }, { dispatch, state }))
    
    return (
        <Provider value={contextValue}>
            {children}
        </Provider>)
}

export {UserContextProvider,userContext}