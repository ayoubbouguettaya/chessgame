import React from 'react'

import styles from './welcome.module.css';
import HeroSection from './helpers/HeroSection';
import OffersSection from './helpers/OfferSection';
import Skeleton from '../UI/Skeleton';
import BackgroundLogo from '../UI/BackgroundLogo';

const WelcomeComponent = () => {
    return (
        <div className={styles.welcome_container}>
            <HeroSection />
            <OffersSection />
        </div>
    )
}

export default WelcomeComponent

export const WelcomeSkeleton = () => (
    <div style={{display: 'flex',alignItems: 'flex-start'}}>
        <div style={{width: '20%'}}>
        <Skeleton width="200px" height="calc(100vh - 60px)" marginTop="10px" >
            
        </Skeleton>
        </div>
        <div style={{width: '80%',height:"calc(100vh - 60px)"}}>
            <BackgroundLogo hideButton />
        </div>
    </div>
)