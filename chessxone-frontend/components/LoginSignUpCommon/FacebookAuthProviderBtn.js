import React, { useState } from 'react'

import useMobileDetect from 'use-mobile-detect-hook';
import {
    signInWithPopup,
    FacebookAuthProvider,
} from 'firebase/auth';
import handleFirebaseError from '../../utils/handleFirebaseError';

const FacebookAuthProviderBtn = ({ auth, setFirebaseError }) => {
    const detectMobile = useMobileDetect();
    const [isLoading, setIsLoading] = useState(false)

    const isMobile = detectMobile.isMobile()

    const signInFacebookWithPopup = async () => {
        try {
            setIsLoading(true)
            const provider = new FacebookAuthProvider();
            provider.addScope('email');
            provider.setCustomParameters({
                'display': 'popup'
            });

            const result = await signInWithPopup(auth, provider);
            const credential = await FacebookAuthProvider.credentialFromResult(result);
            localStorage.setItem("pictureWithAccessToken", JSON.stringify({ picture: result.user.photoURL, access_token: credential.accessToken }))
        } catch (error) {
            setFirebaseError(await handleFirebaseError(auth, error))
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async () => {
        await signInFacebookWithPopup()
    }

    return (
        <button disabled={true} style={{opacity:'0.3'}} onClick={handleSubmit}>
            <img src="/icon/facebook.svg" width="30" height="30" />
            continue with Facebook
            {isLoading && <img src="/icon/loader.svg" width="18" height="18" />}
        </button>
    )
}

export default FacebookAuthProviderBtn
