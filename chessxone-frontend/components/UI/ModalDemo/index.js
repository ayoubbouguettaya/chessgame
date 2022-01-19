import React, { useEffect, useState } from 'react';

import styles from './modal-demo.module.css';
import Box from '../Box';
import { gameStatus } from '../../../game/constants';
import SmallBoard from './helpers/SmallBoard';
import DemoIndicator from './helpers/DemoIndicator';

const ModalDemo = ({ status }) => {
    const [showPanel, setShowPanel] = useState(false)
    const [step,setStep] = useState(0)

    useEffect(() => {
        const hideEducateModal = localStorage.getItem('HIDE_EDUCATE_MODAL');
        if (!hideEducateModal) {
            setShowPanel(true)
            setTimeout(() => {
                handleDismissModal()
            }, 30000);
        }
    }, [])

    useEffect(()=>{
        if(step === 2){
            setTimeout(() => {
                handleDismissModal()
            }, 2000);
        }
    },[step])

    const handleDismissModal = () => {
        setShowPanel(false)
        localStorage.setItem('HIDE_EDUCATE_MODAL', 'true')
    }

    if (!showPanel || status !== gameStatus.running) {
        return (null)
    }

    return (
        <div className={styles.modal_container} >
            <Box className={styles.modal_box}>
                <div className={styles.modal_header}>
                    <h3>Quick Guide about moving pieces</h3>
                    <p> We don&apos;t support <strong>drag and drop</strong>  pieces , instead use <strong>clicks</strong></p>
                </div>
                <div className={styles.modal_body}>
                    <SmallBoard    step={step} setStep={setStep} />
                    <DemoIndicator step={step} />
                </div>
                <div className={styles.modal_footer}>
                    <button onClick={handleDismissModal}>Dismiss </button>
                </div>
            </Box>
        </div>
    )
}

export default ModalDemo
