import React from 'react'

import ProtectedRoute from '../components/ProtectedRoute'
import HomeComponent, { HomeSkeleton } from '../components/Home'

const home = () => {
    return (
        <ProtectedRoute Skeleton={HomeSkeleton}>
            <HomeComponent />
        </ProtectedRoute>
    )
}

export default home
