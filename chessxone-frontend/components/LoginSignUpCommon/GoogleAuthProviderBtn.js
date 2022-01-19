import React,{useState} from 'react'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import useMobileDetect from 'use-mobile-detect-hook';
import handleFirebaseError from '../../utils/handleFirebaseError';

const GoogleAuthProviderBtn = ({ auth,setFirebaseError }) => {
    const detectMobile = useMobileDetect()
    const isMobile = detectMobile.isMobile()
    const [isLoading,setIsLoading] = useState(false)

    const signInGoogleWithPopup = async () => {
        try {
            setIsLoading(true)
            const provider = new GoogleAuthProvider();
            provider.addScope('email');

             await signInWithPopup(auth, provider);
        } catch (error) {
            setFirebaseError(await handleFirebaseError(auth,error))
        }finally{
            setIsLoading(false)
        }
    }

    const handleSubmit = () => {
            signInGoogleWithPopup()
    }

    return (
        <button disabled={isLoading} onClick={handleSubmit}>
            <img src="/icon/google.svg" width="30" height="30" />
            continue with Google
            {isLoading && <img src="/icon/loader.svg" width="18" height="18" />}
        </button>
    )
}

export default GoogleAuthProviderBtn
