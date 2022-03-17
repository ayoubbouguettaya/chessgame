import React, { useState } from 'react'
import AutoManagedBoard from '../../Game/UI/AutoManagedBoard'

import styles from '../home.module.css'

const HistoricalGames = () => {
    const [randomGame, setRandomGame] = useState(games[0])

    const handleSetRandomGame = () => {
        setRandomGame(games[Math.floor(Math.random() * games.length)])
    }

    return (<div className={styles.historical_games_container}>
        <div className={styles.heading}>
            <h1>Historical game</h1>
            <button style={{ display: 'flex', alignItems: 'center', color: 'var(--purple)' }} onClick={handleSetRandomGame}>
                Shuffle
                <img src="/icon/shuffle.svg" width="20" height="20" />
            </button>
            <p> : {randomGame.title}</p>
        </div>
        <AutoManagedBoard  {...randomGame} />
    </div>
    )
}

export default HistoricalGames

const games = [
    {
        whitePlayer: 'Adolf Anderssen',
        blackPlayer: 'Jean Dufresne',
        context: 'Berlin GER (1852) ',
        title: 'The Evergreen Partie',
        description: 'master and student',
        keywords: 'Evans Gambit. Pierce Defense (C52) ',
        moves: ['PE2EE4', 'PE7EE5', 'NG1EF3', 'NB8EC6', 'BF1EC4', 'BF8Ec5', 'PB2EB4', 'BC5Pb4',
            'PC2EC3', 'BB4EA5', 'PD2Ed4', 'PE5PD4', 'O-O', 'PD4ED3', 'QD1Eb3', 'QD8Ef6', 'PE4EE5', 'QF6EG6', 'RF1EE1',
            'NG8EE7', 'BC1EA3', 'PB7EB5', 'QB3PB5', 'RA8EB8', 'QB5Ea4', 'BA5EB6', 'NB1ED2', 'BC8EB7', 'ND2EE4',
            'QG6EF5', 'BC4Pd3', 'QF5EH5', 'NE4Ef6', 'Pg7Kf6', 'PE5Ef6', 'RH8Eg8', 'Ra1Ed1', 'QH5NF3', 'RE1Ne7',
            'NC6Re7', 'QA4Pd7', 'KE8Qd7', 'BD3Ef5', 'KD7Ee8', 'BF5Ed7', 'KE8Ef8', 'BA3Ne7'],
        movesWithNotation: ['e4', 'e5', 'Nf3', 'Nc6', 'Bc4', 'Bc5', 'b4', 'Bb4',
            'c3', 'Ba5', 'd4', 'ed4', 'O-O', 'd3', 'Qb3', 'Qf6', 'e5', 'Qg6', 'Re1',
            'Nge7', 'Ba3', 'b5', 'Qb5', 'Rb8', 'Qa4', 'Bb6', 'Nbd2', 'Bb7', 'Ne4',
            'Qf5', 'Bd3', 'Qh5', 'Nf6', 'gf6', 'ef6', 'Rg8', 'Rad1', 'Qf3', 'Re7',
            'Ne7', 'Qd7', 'Kd7', 'Bf5', 'Ke8', 'Bd7', 'Kf8', 'Be7#']
        , comments: [
            'RawPeds: It looks so much like the 2021 game between Carlsen and Deutsch. Such a coincidence.',
            'DotJayPeg: Obviously Max Deutsch traveled back in time to help Anderssen win this game',
            'Mark Kelly : He hadn\'t taught his student about castling yet.',
            'Brian Zack: I really likes the idea of Andersen let his queen got capturedas he plan ahead of checkmate.Most of us really scared when we lost our queen.He laid out his plan and move gracefully. What a brilliant player',
            'Frank Harris : The greatest Bishop pair in chess history were only two squares away from what you called the "worst Bishop pair in chess history."  Some one should have told Kasparov.  He had been so close.'

        ]
    },
]