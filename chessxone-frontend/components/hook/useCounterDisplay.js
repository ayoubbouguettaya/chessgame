import React, { useState, useEffect } from 'react'

/* the count is on Seconds*/
const useCounterDisplay = (ttlInMin = 10) => {
    const [initialeCount, setInitialeCount] = useState(-1);
    const [count, setCount] = useState(-1);

    const [display, SetDisplay] = useState('')

    useEffect(() => {
        if (count < 60) {
            SetDisplay(`${count}s`)
        } else {
            SetDisplay(`${Math.floor(count / 60)}min`)
        }

        if(Math.floor(count / 60) > ttlInMin){
            SetDisplay('Expired');
        }
    }, [count]);

    useEffect(() => {
        let interval;
        if (initialeCount !== -1) {
            setCount(initialeCount);
          interval =  setInterval(() => {
                setCount(prevCount => prevCount + 1)
            }, 1000)
        }
        return () => clearInterval(interval)
    }, [initialeCount])

const startCount = (initialCountParms) => {
    setInitialeCount(Number.parseInt(initialCountParms))
}

return { count, display, startCount };
}

export default useCounterDisplay
