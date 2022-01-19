import React from 'react'
import styles from '../welcome.module.css'
import Box from '../../UI/Box'
import Link from 'next/link';

const HeroSection = () => (
    <div className={styles.hero_section_container}>
        <LeftPaenl />
        <RightPanel />
    </div>);

export default HeroSection


const RightPanel = () => {
    return (
        <div className={styles.rightpanel_container}>
            <img src="/background.png" draggable="false" />
        </div>
    )
}

const LeftPaenl = () => {

    return (
        <div className={styles.leftpanel_container}>
            <h1  >Become a Member and play chess with Friends</h1>
                <button className={styles.btn_inverted}>
            <Box  containerClassName={styles.btn_box} >
                <Link href="/signup" >Sign Up</Link>
            </Box>
            </button>
            <div style={{ content: '', width: '100%', height: '3px', background: 'var(--purple)', margin: '2rem auto' }} />
            <div>
                <h3>
                    Join Squads and Clubs <span> {' > '}</span>
                    Find and Invite an opponent <span> {' > '}</span>
                    Play a game with seconds <span> {' > '}</span>
                    Stay connected with your Chess Friends .
                </h3>
            </div>
        </div>
    )
}