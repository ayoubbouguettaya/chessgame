const express = require('express');

const AuthRouter = require('./helpers/auth');
const UsersRouter = require('./helpers/users');
const MatchsRouter = require('./helpers/match');
const SavedGamesRouter = require("./helpers/savedGames");

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.send('V2 Mfs')
});

router.use('/auth',AuthRouter);
router.use('/users', UsersRouter);
router.use('/matchs',MatchsRouter);
router.use('/saved-games',SavedGamesRouter);

module.exports = router;
