const express = require('express');

const matchController = require('../../controllers/match');

const auth = require('../../middlewares/auth');
const checkUserId = require('../../middlewares/checkUserId');

const router = express.Router();

router.get('/:userID/request',auth,matchController.getUserGameRequest)
router.get('/:userID/invitations',auth,matchController.getUserGameInvitation);

router.put('/:userID/request',auth,checkUserId,matchController.requestGame)
router.put('/:userID/accept',auth,checkUserId,matchController.acceptGame)

router.put('/:userID/decline',auth,checkUserId,matchController.declineGame)

module.exports = router;
