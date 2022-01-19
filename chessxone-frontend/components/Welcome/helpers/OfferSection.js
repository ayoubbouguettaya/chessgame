import React from 'react'

import styles from '../welcome.module.css'
import Box from '../../UI/Box'

const OffersSection = () => {
    return (
        <div className={styles.offers_section}>
            <Box>
                <ul>
                    <li>Setup and Play games within seconds.  </li>
                    <li>Connect with Friends and Squads. </li>
                    <li>Save and analyse your Games</li>
                    <li>Free Membership.</li>
                    <li>Play tournament</li>
                </ul>
            </Box>
        </div>
    )
}

export default OffersSection
