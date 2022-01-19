const express = require('express');

const { createSessionCookie, removeSessionCookie,getCredentialInfo } = require('../../controllers/auth');
const auth = require('../../middlewares/auth');

const Router = express.Router();

Router.get('/info',auth,getCredentialInfo)
Router.post('/login', createSessionCookie);
Router.get('/logout', removeSessionCookie);

module.exports = Router;