const SavedGames = require('../models/savedGames');
const User = require('../models/user');
const GameOnHotAccess = require('../../hotAccess/game');

exports.saveGame = async (req, res, next) => {
    try {
        const { userID, gameID: gameIDParams } = req.params;
        const gameInfo = await GameOnHotAccess.get(gameIDParams);
        console.log('game Info ',gameInfo);
        if (!gameInfo) {
            return res.sendStatus(403);
        }

        const round = {
            endedBy: gameInfo.endedBy,
            winner: gameInfo.winner,
            whitePlayerID: gameInfo.whitePlayerID,
            blackPlayerID: gameInfo.blackPlayerID,
            moves: gameInfo.moves,
            count: Number.parseInt(gameInfo.count),
        }
        const rounds = [];
        const gameID = gameInfo.gameID;

        const gameStored = await SavedGames.findOne({ gameID })

        if (!gameStored) {
            rounds.push(round)
            const { _id } = await SavedGames.create({ gameID, rounds })
            await User.findByIdAndUpdate(userID, { $push: { savedGames: _id } })
            return res.sendStatus(200);
        }

        if (gameStored.rounds.findIndex((gameround) => (gameround.count === round.count)) === -1) {
            gameStored.rounds.push(round)
            await gameStored.save()
            return res.sendStatus(200)
        }
        res.sendStatus(403)
    } catch (error) {
        console.log('error in saving', error.message)
    }
}
