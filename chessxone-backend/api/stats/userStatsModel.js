const { Schema, model } = require('mongoose');

const statsSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
    },
    gamesCount: Number,
    recordedActivity: [{
        day: String,
        gamesCount: Number,
    }]
});

module.exports = model('UserStats', statsSchema);
