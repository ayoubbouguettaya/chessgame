const { Schema, model } = require('mongoose');
const { endedBy, COLOR } = require('../../utils/constants');

const gameSchema = new Schema({
    gameID: {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
    },
    rounds: [{
        endedBy: {
            type: String,
            enum: [endedBy.CHECK_MATE, endedBy.DRAW, endedBy.RESIGN, endedBy.STEAL_MATE]
        },
        winner: {
            type: String,
            enum: [COLOR.WHITE, COLOR.BLACK]
        },
        whitePlayerID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        blackPlayerID: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        },
        moves: String,
        count: Number,
    }]
});

module.exports = model('SavedGame', gameSchema);
