import React, { useContext, useEffect } from 'react'
import { useRouter } from 'next/router';

import { userContext } from '../store/user/context'
import BackgroundLogo from './UI/BackgroundLogo';

const ProtectedRoute = ({ children, Skeleton :  PageSkeleton }) => {
    const { state: { user, hasSignedUp, hasLoggedIn, isLoading, error } } = useContext(userContext);
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!hasLoggedIn) {
                router.replace('/login')
            } else {
                if (!hasSignedUp) {
                    router.replace('/signup')
                }
            }
        }
        return () => { }
    }, [isLoading, hasSignedUp, hasLoggedIn]);

    if (isLoading) {
        if (PageSkeleton) {
            return (<div><PageSkeleton /></div>)
        } else {
            return (<BackgroundLogo hideButton />)
        }
    }

    if (error || !user || !user._id) {
        return (<div>
            <p style={{textAlign: 'center',marginTop:'4rem'}}>
                Error on the Server,please try to reload the page
            </p>
        </div>)
    }
    return (
        <div>
            {children}
        </div>
    )
}

export default ProtectedRoute
