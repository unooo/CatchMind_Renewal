let Room = require('../repository/room');

exports.createRoom = async function (title, owner, ownerId) {
    await new Room({
        title, owner, ownerId,
    }).save();
}

exports.readRoomList = async function () {
    let rooms = await Room.find({});
    return rooms;
};

exports.readRoom = async function (roomId) {
    let room = await Room.findOne({ _id: roomId });
    return room;
}
exports.deleteRoom = async function (roomId) {
    let deleteRoom = await Room.findByIdAndDelete(roomId);
    if (deleteRoom)
        return true;
    else
        return false;
}

exports.increaseRoomNumberByRoomId = async function (roomId,) {
    let room = await Room.findOne({ _id: roomId });
    room.attendants_num++;
    room = await Room.findByIdAndUpdate(roomId, room);
    if (room)
        return true;
    else
        return false;
};
exports.decreaseRoomNumberByRoomId = async function (roomId,) {
    let room = await Room.findOne({ _id: roomId });
    room.attendants_num--;
    room = await Room.findByIdAndUpdate(roomId, room);
    if (room)
        return true;
    else
        return false;
};