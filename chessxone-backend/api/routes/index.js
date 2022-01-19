const express = require('express');

const AuthRouter = require('./helpers/auth');
const UsersRouter = require('./helpers/users');
const UserGameRouter = require('./helpers/userGame');

const router = express.Router();

router.get('/', async (req, res, next) => {
    res.send('V2 Mfs')
});

router.use('/auth',AuthRouter);
router.use('/users', UsersRouter);
router.use('/user-game',UserGameRouter)

module.exports = router;
