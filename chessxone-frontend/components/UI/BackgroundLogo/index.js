import React from 'react';
import Link from 'next/link';

import styles from './background-logo.module.css'
import Box from '../Box';

const BackgroundLogo = ({ message, hideButton }) => {


    return (
        <div className={styles.container}>
            <p>{message}</p>
            {!hideButton && (
                <div>
                    <Link href="/">
                        <Box>
                            <button>
                                go back home
                 </button>
                        </Box>
                    </Link>
                </div>
            )}
            <img src="/chessone-invert.png" />
        </div>
    )
}

export default BackgroundLogo
