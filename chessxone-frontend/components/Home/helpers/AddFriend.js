import React, { useState, useContext } from 'react'

import styles from '../home.module.css';

import useForm from '../../hook/useForm';
import apiFetch from '../../../utils/apiFetch';
import Loading from '../../UI/Loading';
import { userContext } from '../../../store/user/context';
import { REQUEST_CONNECTION_SUCCESS } from '../../../store/user/actions';

const AddFriend = () => {
    const { dispatch, state: { user: { _id: userID } } } = useContext(userContext);

    const [values, handleOnChange] = useForm({ tagID: '' })
    const [error, setError] = useState('');
    const [user, setUser] = useState(null)
    const [isLoading, setIsLoading] = useState(false);
    const [requestConnectionLoading, setIsrequestConnectionLoading] = useState(false)

    const searchFriendByTagID = async () => {
        try {
            setIsLoading(true)
            setError('')
            setUser(null)
            const tagID = values.tagID.replaceAll(/#|\./ig, '');
            if (tagID.length !== 7) {
                setError('expect 7 digits')
                return;
            }

            const { data } = await apiFetch.get({ url: `/users/byTagID/${tagID}` })
            setUser(data);
        } catch (error) {

        } finally {
            setIsLoading(false)
            return;
        }
    };

    const requestFriendConnection = async () => {
        try {

            setIsrequestConnectionLoading(true)
            const friendID = user._id;
            await apiFetch.post({ url: `/users/${userID}/connection/requests`, data: { userID: friendID } })
            dispatch({ type: REQUEST_CONNECTION_SUCCESS, payload: user });
            setIsrequestConnectionLoading(false)
            setUser(null)
        } catch (error) {
            setError('request friend Failed')
        } finally {
            setIsrequestConnectionLoading(false)
            setUser(null)
        }
    }

    return (
        <div className={styles.add_friend_container}>
            <p>Add Friend</p>
            <div className={styles.input_container}>
                <input name="tagID" value={values.tagID} onChange={handleOnChange} placeholder="Enter Player ID #589626" />
                <button disabled={isLoading} onClick={searchFriendByTagID}><img src="/icon/search.svg" /></button>
            </div>
            <p style={{ color: 'orange', fontSize: '14px', textAlign: 'center' }}>{error}</p>
            {isLoading && (<div className={styles.loading_container}><Loading /></div>)}
            {user && (
                <div className={styles.user_avatar_name}>
                    <div className={styles.avatar}>
                        <img referrerPolicy="no-referrer" src={user.picture || '/icon/default.webp'} />
                    </div>
                    <p>{user.userName}</p>
                    <button onClick={requestFriendConnection}>
                        {!requestConnectionLoading ? (<img src="/icon/user-plus.svg" />) : '...'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AddFriend
