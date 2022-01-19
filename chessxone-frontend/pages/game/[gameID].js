import React from 'react'

import GameComponent from '../../components/Game'
import { GameContextProvider } from '../../store/game/context';
import ProtectedRoute from '../../components/ProtectedRoute';

const GamePage = () => {
    return (
        <>
            <GameContextProvider>
                <ProtectedRoute>
                    <GameComponent />
                </ProtectedRoute>
            </GameContextProvider>
        </>
    )
}

export default GamePage
