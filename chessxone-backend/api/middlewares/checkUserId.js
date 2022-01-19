const User = require("../models/user");

module.exports = async (req, res, next) => {
    try {
        const { userID } = req.params;
        const { userPayload: { uid: firebaseId } } = req;

        const userFound = await User.findOne({ firebaseId });
        if (!userFound) {
            return res.sendStatus(404);
        }

        if ( userFound._id.toString() !== userID) {
            return res.sendStatus(403);
        }
        req.user = userFound;

        next();
        return;
    } catch (error) {
        next(error)
        return;
    }
}