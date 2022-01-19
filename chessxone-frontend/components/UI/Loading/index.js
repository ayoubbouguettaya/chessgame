import React from 'react';

import styles from './loading.module.css';

const Loading = ({cirle}) => {

    if(cirle){
        return (<div className={styles.lds_ripple}><div></div><div></div></div>)
    }
    return (
        <div className={styles.loading_container}>
            <div className={styles.la_ball_8bits}>
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
                <div />
            </div>
        </div>
    )
}

export default Loading
