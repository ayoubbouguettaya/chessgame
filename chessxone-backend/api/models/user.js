const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    firebaseId: {
        type: String,
        required: true,
        unique: true,
    },
    provider: String,
    email: {
        type: String,
    },
    tagID: {
        type: Number,
        required: true,
        unique: true,
    },
    userName: String,
    level: String,
    bio: String,
    picture: String,
    connections: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    incomingRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    outgoingRequests: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    savedGames : [
        {
            type: Schema.Types.ObjectId,
             ref: 'Game'
        }
    ]
});

module.exports = model('User', userSchema);
