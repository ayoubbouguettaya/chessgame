import React, { useState, useEffect } from 'react'

/* the count is on Seconds*/
const useCounterDisplay = (ttlInMin = 10) => {
    const [count, setCount] = useState(-200);
    const [display, SetDisplay] = useState('')

    useEffect(() => {
        if (count < 60) {
            SetDisplay(`${count}s`)
        } else {
            SetDisplay(`${Math.floor(count / 60)}min`)
        }

        if (Math.floor(count / 60) > ttlInMin) {
            SetDisplay('Expired');
        }

        if (count < 0) {
            SetDisplay('---');
        }
    }, [count]);

    useEffect(() => {
        let interval;
        interval = setInterval(() => {
            setCount(prevCount => prevCount + 1)
        }, 1000);

        return () => clearInterval(interval)
    }, []);


    const startCount = (initialCountParms) => {
        setCount(Number.parseInt(initialCountParms))
    };

    return { count, display, startCount };
}

export default useCounterDisplay
