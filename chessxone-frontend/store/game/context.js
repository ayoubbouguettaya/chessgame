import { createContext, useMemo, useReducer } from 'react'

import reducer from './reducer'
import { gameStatus } from '../../components/Game/gameLogic/constants';

const initialData = {
    gameID: undefined,
    blackUserName: undefined,
    whiteUserName: undefined,
    playerColor: '',
    board: [],
    selectedSquare: undefined,
    allowedSquares: [],
    previousTrackedSquare: undefined,
    kingHighlighted : undefined,

    turn: undefined,
    status : gameStatus.loading,
    timerType: undefined,
    
    waitPromotePawn: false,
    opponentPawnToPromote: undefined,
   
    possibilityToCastle: [], /* QUEEN_SIDE KING_SIDE BOTH_SIDE */
    forbidenToCastle: [],
   
    runTimer: false,

    message: '',
    winner: '',
    endedBy: '' /* Resign stealmate checkmate timeout */
}

const gameContext = createContext({})

const { Provider } = gameContext;

const GameContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer,initialData)

    const contextValue = useMemo(() => ({ dispatch, state }, { dispatch, state }))
    return (
        <Provider value={contextValue}>
            {children}
        </Provider>)
}

export {GameContextProvider,gameContext}