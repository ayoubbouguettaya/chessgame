import React, { useState, useContext } from 'react'
import Joi from 'joi';

import useForm from '../../hook/useForm';

import styles from '../profile.module.css';
import apiFetch from '../../../utils/apiFetch'
import fetchUser from '../../../utils/fetchUser';
import { userContext } from '../../../store/user/context';

const ProfileForm = ({ userID, userName, email, bio = ''}) => {
    const [values, handleOnChange] = useForm({ bio });
    const [isLoading, setIsLoading] = useState(false);
    const [error, seterror] = useState('')
    const { dispatch } = useContext(userContext);

    const editProfileInfo = async (data) => {
        try {
            setIsLoading(true)
            const  validatedData = await schema.validateAsync(data);
            await apiFetch.put({ url: `/users/${userID}`, data:validatedData })
            await fetchUser(dispatch)
            seterror('')
        } catch (error) {
            seterror(error.message)
        }finally{
            setIsLoading(false)
        }
    }

    return (
        <div className={styles.form_container}>
            <label>
                User name :
            <input name="userName" readOnly value={userName} disabled />
            </label>
            <label>
                Email :
            <input name="userName" readOnly value={email} disabled />
            </label>
            <label>
                Bio:
            <textarea name="bio" value={values.bio} onChange={handleOnChange} />
            </label>
             <p style={{color:'red',fontSize:'14px'}}>{error}</p>
            <button onClick={() => editProfileInfo(values)} disabled={isLoading} >
                Edit {isLoading && '...'}
            </button>
        </div>
    )
}

export default ProfileForm

const schema = Joi.object({
    bio: Joi.string()
        .min(0)
        .max(50),
})
