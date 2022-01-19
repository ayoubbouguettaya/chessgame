import React from 'react'

import { MUST_LOGIN, MUST_SIGNUP, ERROR, FETCH_USER_SUCCESS, LOADING, DONE } from '../store/user/actions'
import apiFetch from './apiFetch';

const fetchUser = async (dispatch) => {
        try {
            dispatch({ type: LOADING})
            const response = await apiFetch.get({ url: '/users/current' })
            dispatch({ type: FETCH_USER_SUCCESS, payload: { user: response.data } })

        } catch (error) {
            if (error.response) {
                const { status } = error.response || 500;
                console.log('status',error.response.status)
                switch (status) {
                    case 404:
                        dispatch({ type: MUST_SIGNUP})
                        break;
                    case 401:
                        dispatch({ type: MUST_LOGIN });
                        break;
                    default:
                        dispatch({ type: ERROR, payload: { code: error.response.status, message: error.response.message || '' } })
                        break;
                }
            }
        }
        finally {
            dispatch({ type: DONE })
        }
}

export default fetchUser
