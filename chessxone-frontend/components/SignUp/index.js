import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import firebase from '../../utils/firebaseInstance';
import {
    onAuthStateChanged,
    getAuth,
    signOut,
    updateProfile,

} from 'firebase/auth'
import { userContext } from '../../store/user/context'

import EmailPasswordInputs from '../LoginSignUpCommon/EmailPasswordInputs';
import GoogleAuthProviderBtn from '../LoginSignUpCommon/GoogleAuthProviderBtn';
import FacebookAuthProviderBtn from '../LoginSignUpCommon/FacebookAuthProviderBtn';
import Skeleton from '../UI/Skeleton';
import Form from './helpers/Form';


import apiFetch from '../../utils/apiFetch'
import fetchUser from '../../utils/fetchUser';

import styles from './signup.module.css'

const SignUpComponent = () => {
    const { dispatch, state: { hasSignedUp, hasLoggedIn, isLoading } } = useContext(userContext);
    const [auth, setAuth] = useState(null);
    const [firebaseError, setFirebaseError] = useState('')
    const [isloadingDelay, setIsLoadingDelay] = useState(true)
    const router = useRouter();

    useEffect(() => {
        setAuth(getAuth(firebase))
        return () => {
        }
    }, [])

    useEffect(() => {
        if (!isLoading) {
            if (hasSignedUp) {
                router.replace('/home')
            }
        }
        return () => { }
    }, [isLoading, hasSignedUp, hasLoggedIn]);

    const handleCreateUser = async (data) => {
        try {
            await apiFetch.post({ url: '/users', data })
            await fetchUser(dispatch)
            return ;
        } catch (error) {
            if(error.response){
                throw new Error(error.response.data)
            }
            return error;
        }
    }

    useEffect(() => {
        if (auth) {
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    try { /* update Profile */
                        const idToken = await currentUser.getIdToken();
                        await apiFetch.post({ url: '/auth/login', data: { idToken } });
                        await fetchUser(dispatch)
                        setFirebaseError('')
                    } catch (error) {
                        console.log(error.message)
                    }
                }

                const timer = setTimeout(async () => {
                    const pictureWithAccessToken = localStorage.getItem("pictureWithAccessToken");

                    if (pictureWithAccessToken) {
                        const { picture, access_token } = JSON.parse(pictureWithAccessToken);
                        if(!picture.includes('access_token')){
                            await updateProfile(currentUser, { photoURL: `${picture}?access_token=${access_token}` })
                        }
                        localStorage.removeItem("pictureWithAccessToken")
                    }
                    await signOut(auth)
                    setIsLoadingDelay(false)
                    clearTimeout(timer);
                }, 2000);
            })
        }

    }, [auth])

    if (isLoading || isloadingDelay) {
        return (<div><Skeleton marginTop="2rem" width="400px" height="500px" /></div>)
    }

    return (
        <div className={styles.signup_container} >
            <div className={`${firebaseError && styles.firebase_error_display}`}>
                {firebaseError}
            </div>
            <h1>create an account and become a Member.</h1>
            {!hasLoggedIn ? (
                <div className={styles.firebase_auth_container}>
                    <EmailPasswordInputs auth={auth} setFirebaseError={setFirebaseError} />
                    <div className={styles.divider}>or </div>
                    <GoogleAuthProviderBtn auth={auth} setFirebaseError={setFirebaseError} />
                    <FacebookAuthProviderBtn auth={auth} setFirebaseError={setFirebaseError} />
                </div>
            ) : (
                    <Form handleCreateUser={handleCreateUser} />
                )}
        </div>
    )
}

export default SignUpComponent
