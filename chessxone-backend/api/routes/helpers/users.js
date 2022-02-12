const express = require('express');

const userController = require('../../controllers/user');

const auth = require('../../middlewares/auth');
const checkUserId = require('../../middlewares/checkUserId');

const router = express.Router();

router.get('/current', auth, userController.getCurrent);
router.get('/:userID/',auth,userController.getOne);
router.get('/byTagID/:tagID',auth,userController.getByTagID);

router.post('/', auth, userController.add);
router.put('/:userID',auth,checkUserId,userController.edit);

router.get('/:userID/connections/requests',auth,userController.getAllConnectionRequests);
router.get('/:userID/connection/online',auth,userController.getOnlineConnections);

router.post('/:userID/connection/requests',auth,userController.addConnectionRequest)
router.put('/:userID/connection/approve',auth,userController.approveConnectionRequest)

router.put('/:userID/games/:gameID',auth,userController.saveGame);

router.get('/:userID/feed',auth,userController.getFeed);

module.exports = router;
