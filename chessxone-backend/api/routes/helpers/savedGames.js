const router = require("express").Router();

const savedGameController = require("../../controllers/savedGame")

router.put('/:gameID/personal/:userID',savedGameController.saveGame)

module.exports = router;
