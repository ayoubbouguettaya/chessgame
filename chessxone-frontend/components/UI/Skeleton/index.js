import React from 'react';

import styles from './skeleton.module.css'

const Skeleton = ({ height, width,minWidth,marginTop,marginRight,marginLeft,fill,children }) => (
    <div
        className={styles.container}
        style={{
            width: fill ? '100%' : width,
            height: fill ? '100%' : height,
            minWidth: fill ? '100%' : minWidth,
            marginTop: marginTop ? marginTop: '0px',
            marginRight: marginRight ? marginRight : 'auto',
            marginLeft: marginLeft ? marginLeft : 'auto'

        }}
    >
        {children}
    </div>
)

Skeleton.defaultProps = {
    height: '30px',
    width: '100px',
    minWidth: '100px',
}
export default Skeleton
