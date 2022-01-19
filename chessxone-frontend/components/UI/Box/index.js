import React from 'react';

import styles from './box.module.css';

const Box = ({ children, className = "",containerClassName= "" ,inverted,white}) => {
    return (
        <div className ={`${styles.border_container} ${white && styles.white} ${inverted && styles.inverted} ${containerClassName}`}>
            <span className={styles.border} />
            <span className={styles.border} />
            <div className={className}>
            {children}
            </div>
        </div>
    )
}

export default Box
