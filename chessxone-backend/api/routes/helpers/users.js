const express = require('express');

const userController = require('../../controllers/user');

const auth = require('../../middlewares/auth');
const checkUserId = require('../../middlewares/checkUserId');

const router = express.Router();

router.get('/current', auth, userController.getOne);
router.get('/byTagID/:tagID',auth,userController.getByTagID);

router.post('/', auth, userController.add);
router.put('/:userID',auth,checkUserId,userController.edit);

router.get('/:userID/connections/requests',auth,userController.getAllRequests);
router.get('/:userID/connection/online-friend',auth,userController.getOnlineFriend);

router.post('/:userID/connection/requests',auth,userController.addConnectionRequest)
router.put('/:userID/connection/approve',auth,userController.approveConnectionRequest)

router.get('/:userID/friend-info/:friendID',auth,userController.getFriendInfo);
router.get('/:userID/user-info/',auth,userController.getUserInfo);

router.put('/:userID/games/:gameID',auth,userController.saveGame);

router.get('/:userID/feed',auth,userController.getFeed)

module.exports = router;
