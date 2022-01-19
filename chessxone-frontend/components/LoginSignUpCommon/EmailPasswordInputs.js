import React, { useState } from 'react'


import Box from '../UI/Box';
import useForm from '../hook/useForm'

import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import handleFirebaseError from '../../utils/handleFirebaseError';
import styles from './input.module.css'

const EmailPasswordInputs = ({ auth, setFirebaseError, mode = 'signUp' }) => {
    const [values, handleOnChange] = useForm({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)

    const handleSubmit = async () => {
        try {
            setIsLoading(true)
            if (mode !== 'signUp') {
                await handleSignInWithEmailAndPassword(values.email, values.password)
            } else {
                await handlecreateUserWithEmailAndPassword(values.email, values.password)
            }
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    const handleSignInWithEmailAndPassword = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setFirebaseError(await handleFirebaseError(auth, error))
        }
    }

    const handlecreateUserWithEmailAndPassword = async (email, password) => {
        try {
            await createUserWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setFirebaseError(await handleFirebaseError(auth, error))
        }
    }

    return (
        <Box>
            <label>
                email
                <input name="email" value={values.email} onChange={handleOnChange} />
            </label>
            <div className={styles.password_container}>
                <label>
                    password
                <input name="password" type={showPassword ? "text" : "password"} value={values.password} onChange={handleOnChange} />
                    <button
                        onClick={() => setShowPassword((state) => !state)} >
                        {showPassword ?
                            <img src="/icon/eye.svg" height="15" width="15" /> :
                            <img src="/icon/eye-off.svg" height="15" width="15" />}
                    </button>
                </label>
            </div>
            <button disabled={isLoading} onClick={handleSubmit}>
                {mode === 'signUp' ? 'Sign Up' : 'Login'}
                {isLoading && <img src="/icon/loader.svg" width="18" height="18" />}
            </button>
        </Box>
    )
}

export default EmailPasswordInputs
