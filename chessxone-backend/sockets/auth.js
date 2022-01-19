const firebaseAdmin = require('../config/firebase-admin')

const User = require("../api/models/user")

const verifySession = async (sessionID) => {
    try {
        const decodedClaims = await firebaseAdmin.auth().verifySessionCookie(sessionID, true);

        const { uid: firebaseId } = decodedClaims;
        const user = await User.findOne({ firebaseId }).lean();
        if (!user) {
            return null;
        }

        const { _id } = user;

        return _id
    } catch (error) {
        return error;
    }
}

module.exports = {
    verifySession,
}