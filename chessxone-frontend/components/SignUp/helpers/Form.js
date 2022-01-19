import React, { useEffect, useState } from 'react'
import Joi from 'joi'

import styles from '../signup.module.css';
import useForm from '../../hook/useForm'
import apiFetch from '../../../utils/apiFetch'
import Skeleton from '../../UI/Skeleton';

const Form = ({ handleCreateUser }) => {
    const [values, handleOnChange] = useForm({ userName: ''})
    
    const [credentialInfo, setCredetialInfo] = useState(null);
    const [usePicture,setUsePicture] = useState(false);
    const [isLoadingCredentialInfo, setIsLoadingCredentialInfo] = useState(true)
    const [error,setError] = useState(null);

    useEffect(() => {
        const fetchUserInfoCredential = async () => {
            try {
                const { data } = await apiFetch.get({ url: '/auth/info' });
                setCredetialInfo(data)
                if (data.picture) {
                    setUsePicture(true)
                }
                if (data.name) {
                    handleOnChange({ target: { name: 'userName', value: data.name }, persist: () => { } })
                }
                setIsLoadingCredentialInfo(false)

            } catch (error) {
                console.log(error)
            }
        }
        fetchUserInfoCredential()
    }, [])


    const toggleCheckBox = () => {
        setUsePicture((state) => !state)
    }

    const handleCreateUserWithValidation = async () => {
        try {
            setError('')
            const  validatedData = await schema.validateAsync(values);
            await handleCreateUser({ ...validatedData, usePicture }) 
    }
    catch (err) { 
            setError(err.message)
        }
    }

    return (
        <div className={styles.form_container}>
            <div>
                <div className={`${styles.avatar_container} ${credentialInfo && !credentialInfo.picture && styles.disabled} `}>
                    {isLoadingCredentialInfo ?
                        (
                            <Skeleton height="96px" width="96px" />
                        ) : (
                            <>
                                {usePicture && credentialInfo && credentialInfo.picture ? (
                                    <img referrerPolicy="no-referrer" src={credentialInfo.picture} />
                                ): (<img src="/avatars/default.webp" />)}
                            </>
                        )}
                </div>
            </div>
            <div>
            </div>
            {credentialInfo && credentialInfo.picture && (
                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <input
                        style={{ width: 'unset' }}
                        type="checkbox"
                        onChange={toggleCheckBox}
                        checked={usePicture}
                    />
                    use the picture from my account
                </label>
            )}
            <p className={styles.disabled}>Email:  {credentialInfo && credentialInfo.email}</p>
            <label>
                User name :
                <input name="userName" value={values.userName} onChange={handleOnChange} />
            </label>
            <p style={{color:'red',fontSize:'14px'}}>{error}</p>
            <button onClick={handleCreateUserWithValidation} >
                Go play
            </button>
        </div>
    )
}

export default Form

const schema = Joi.object({
    userName: Joi.string()
        .min(7)
        .max(20)
        .required(),
})

