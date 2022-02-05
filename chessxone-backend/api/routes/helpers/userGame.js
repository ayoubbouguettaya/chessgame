const express = require('express');

const userGameController = require('../../controllers/userGame');

const auth = require('../../middlewares/auth');
const checkUserId = require('../../middlewares/checkUserId');

const router = express.Router();

router.get('/:userID/request',auth,userGameController.getUserGameRequest)
router.get('/:userID/invitations',auth,userGameController.getUserGameInvitation);

router.put('/:userID/request',auth,checkUserId,userGameController.requestGame)
router.put('/:userID/accept',auth,checkUserId,userGameController.acceptGame)

router.put('/:userID/decline',auth,checkUserId,userGameController.declineGame)

module.exports = router;
