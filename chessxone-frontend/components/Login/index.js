import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';

import firebase from '../../utils/firebaseInstance';
import {
    onAuthStateChanged,
    getAuth,
    signInWithEmailAndPassword,
    signOut,
    updateProfile,
} from 'firebase/auth'
import { userContext } from '../../store/user/context';
import apiFetch from '../../utils/apiFetch'
import fetchUser from '../../utils/fetchUser';

import EmailPasswordInputs from '../LoginSignUpCommon/EmailPasswordInputs';
import GoogleAuthProviderBtn from '../LoginSignUpCommon/GoogleAuthProviderBtn';
import FacebookAuthProviderBtn from '../LoginSignUpCommon//FacebookAuthProviderBtn';
import Skeleton from '../UI/Skeleton';

import styles from './login.module.css'

const LoginComponent = () => {
    const [auth, setAuth] = useState(null);
    const [firebaseError,setFirebaseError] = useState('')

    const { dispatch, state: { hasSignedUp, hasLoggedIn, isLoading, error } } = useContext(userContext);
    const [isloadingDelay, setIsLoadingDelay] = useState(true)
    const router = useRouter();

    useEffect(() => {
        setAuth(getAuth(firebase))
        return () => {
        }
    }, [])

    useEffect(() => {
        if (!isLoading && !isloadingDelay) {
            if (hasLoggedIn) {
                if (hasSignedUp) {
                    router.replace('/home');
                } else {
                    router.replace('/signup')
                }
            }
        }
        return () => { }
    }, [isLoading,isloadingDelay, hasSignedUp, hasLoggedIn]);


    const getIdToken = async () => {
        return await auth.currentUser.getIdToken();
    }

    useEffect(() => {
        if (auth) {
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    const idToken = await getIdToken()
                    await apiFetch.post({ url: '/auth/login', data: { idToken } });
                    await fetchUser(dispatch)
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

    if (isLoading) {
        return (<div><Skeleton marginTop="2rem" width="400px" height="500px" /></div>)
    }

    return (
        <div className={styles.login_container} >
            {
                !hasLoggedIn && (
                    <>
                    <div className={`${firebaseError && styles.firebase_error_display}`} >
                        {firebaseError}
                    </div>
                        <h1>Login into your account</h1>
                        <div className={styles.firebase_auth_container}>
                            <EmailPasswordInputs auth={auth} setFirebaseError={setFirebaseError} mode="Login" />
                            <div className={styles.divider}>or </div>
                            <GoogleAuthProviderBtn auth={auth} setFirebaseError={setFirebaseError} />
                            <FacebookAuthProviderBtn auth={auth} setFirebaseError={setFirebaseError} />
                        </div>
                    </>)}
        </div>
    )
}

export default LoginComponent

