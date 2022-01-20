let CreateRoomError = require('./RoomError');
module.exports=class extends CreateRoomError{
    constructor(message) {
        super(message);
    }
}