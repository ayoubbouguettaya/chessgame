import React from 'react'

import styles from '../profile.module.css';
import Box from '../../UI/Box';

const LeftSide = () => {
    return (
        <div className={styles.left_side_container}>
            <Box>
                <button>
                    Personal Info
                </button>
                <button disabled>
                   Friends
                </button>
                <button disabled>
                    Saved Games
                </button>
                <button disabled>
                    Activity
                </button>
                <button disabled>
                    Notifications
                </button>
            </Box>
        </div>
    )
}

export default LeftSide
