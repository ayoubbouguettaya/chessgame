import React from 'react'

import styles from '../modal-demo.module.css';

const stepsDemo = [{
    h3: 'Click to Select the King',
    p: 'just click on it first'
}, {
    h3: 'Click to Grap the pawn',
    p: 'second click on the pawn (same thing for empty squares) '
}, {
    h3: 'that\'s it !',
    p: 'hopefully you find it useful'
}]

const DemoIndicator = ({ step }) => {
    return (
        <div>{stepsDemo[step] && (<>
            <h3>{stepsDemo[step].h3} </h3>
            <p>{stepsDemo[step].p}</p>
        </>)}
        </div>
    )
}

export default DemoIndicator
