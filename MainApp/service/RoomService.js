let RoomRepository = require('../repository/room');
let NotExistRoomIDError = require('../exception/NotExistRoomIDError');
exports.createRoom = async function ({title, owner, ownerId}) {
    let ret = await  RoomRepository.create({
        title, owner, ownerId,
    });
    return ret;
}

exports.readRoomList = async function () {
    let rooms = await RoomRepository.find({});
    return rooms;
};

exports.readRoom = async function (roomId) {
    let room = await RoomRepository.findOne({ _id: roomId });
    return room;
}
exports.deleteRoom = async function (roomId) {
    let deleteRoom = await RoomRepository.findByIdAndDelete(roomId);
    if (deleteRoom)
        return true;
    else
        throw new NotExistRoomIDError("delete room fail") ;
}

exports.changeRoomAttendantsByRoomId = async function (mode,roomId,) {
    let room = await RoomRepository.findOne({ _id: roomId });
    if(!room)
         throw new NotExistRoomIDError("delete room fail") ;
    if(mode==0)
        room.attendants_num++;
    else
        room.attendants_num--;
    
    await RoomRepository.findByIdAndUpdate(roomId, room);    
    return true;
};
