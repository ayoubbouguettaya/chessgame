import React from 'react'

import styles from './modal.module.css';
import Link from 'next/link';

const ModalGameUnavailble = () => {
    return (
        <div className={styles.modal_container}>
            <div>
             <p>the Game is Unavailable</p>
             <button>
             <Link href="/home">Back To Lobby </Link>
             </button>
            </div>
        </div>)
}

export default ModalGameUnavailble;
