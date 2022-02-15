const UserStats = require("./userStatsModel");

exports.incrementGameCount = async (userID) => {
    try {
        await UserStats.findOneAndUpdate({ userID }, { $inc: { gamesCount: 1 } }, { upsert: true })
        await UserStats.findOneAndUpdate({ userID: opponentID }, { $inc: { gamesCount: 1 } }, { upsert: true })
    } catch (error) {
        return error;   
    }
}