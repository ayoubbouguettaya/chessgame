const admin = require('../../config/firebase-admin');

exports.createSessionCookie = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        const decodedToken = await admin.auth().verifyIdToken(idToken);

        const expiresIn = 60 * 60 * 24 * 10 * 1000;
        const delayToken = 60 * 60; /* 1 hours */
        if (new Date().getTime() / 1000 - decodedToken.auth_time < delayToken) {
            const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
            const options = { maxAge: expiresIn, httpOnly: true };
            res.cookie('session', sessionCookie, options);
            console.log('create session successfully');
            res.sendStatus(200);
            return;
        } else {
            res.status(401).send('Recent sign in required!');
        }
    } catch (error) {
        next(error)
        return;
    }
};

exports.removeSessionCookie = async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';
    res.clearCookie('session');
    res.clearCookie('validetoken');
    admin.auth().verifySessionCookie(sessionCookie)
        .then((decodedClaims) => {
            return admin.auth().revokeRefreshTokens(decodedClaims.sub);
        })
        .then(() => {
            res.sendStatus(200)
        });
};

exports.getCredentialInfo = async (req, res, next) => {
    try {
        const { userPayload } = req;
        const { name, picture, email, firebase: { sign_in_provider } } = userPayload;
        return res.send({ name, picture, email, provider: sign_in_provider })

    } catch (error) {
        console.log(error.message)
        res.status(401).send("{'error':'unauthorized'}");
        return;
    }

}