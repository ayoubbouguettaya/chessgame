import React, { useContext } from 'react'

import { userContext } from '../../store/user/context';

import styles from './profile.module.css';
import ProfileForm from './helpers/ProfileForm';
import LeftSide from './helpers/LeftSide';

const ProfileComponent = () => {
    const { state: { user } } = useContext(userContext);
    const { _id: userID } = user || {};

    return (
        <div className={styles.profile_container}>
            <LeftSide />
            <div className={styles.main_profile_container}>
                {user && <ProfileForm 
                userName={user.userName}
                 userID={userID}
                  email={user.email}
                  level={user.level}
                  bio={user.bio}
                  />}
            </div>
        </div>
    )
}

export default ProfileComponent
