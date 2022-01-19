let express = require('express');
let router = express.Router();
let roomController = require("../controller/RoomController");
module.exports = function (io) {
    router.get('/:roomId',roomController.getRoom );
    router.post('/',roomController.createRoom);
    router.delete('/',roomController.deleteRoom);
    router.put("/:roomId",roomController.exitRoom);
    return router;
}
