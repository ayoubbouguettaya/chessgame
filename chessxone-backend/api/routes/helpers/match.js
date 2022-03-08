const express = require('express');

const matchController = require('../../controllers/match');

const auth = require('../../middlewares/auth');
const checkUserId = require('../../middlewares/checkUserId');
const validateQueryuserID = require('../../validations/validateQueryuserID');

const router = express.Router();

router.get('/:userID/outgoing', validateQueryuserID, auth, matchController.getOutGoingRequest)
router.get('/:userID/incoming', validateQueryuserID, auth, matchController.getInComingRequest);

router.put('/:userID/request', validateQueryuserID, auth, checkUserId, matchController.requestGame)
router.put('/:userID/accept', validateQueryuserID, auth, checkUserId, matchController.acceptGame)
router.put('/:userID/decline', validateQueryuserID, auth, checkUserId, matchController.declineGame)

module.exports = router;
