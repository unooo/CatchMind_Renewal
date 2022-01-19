let chatService = require('../service/ChatService');
let roomService = require('../service/RoomService');
exports.getRoom= async function (request, response) {
    if(!request.isAuthenticated()){
        response.redirect('/?ret=Please_Login');
    }// 클라이언트단에서 막아두긴했으나 일단처리해둠
    const myId = request.user.id;
    let rId = request.params.roomId;
    let chats = await chatService.readChatByRoomId(rId);
    roomService.increaseRoomNumberByRoomId(rId);
    response.render('conference.ejs', { rId, chats, myId });
};

exports.exitRoom = async function(request,response){
    if(!request.isAuthenticated()){
        response.redirect('/?ret=Please_Login');
    }// 클라이언트단에서 막아두긴했으나 일단처리해둠    
    let rId = request.params.roomId;
    roomService.decreaseRoomNumberByRoomId(rId);
    response.send({status:"ok"});
}

exports.createRoom= async function (request, response) {
    if (!request.isAuthenticated()) {
        response.send({
            status: false,
            reason: "please Login",
        });
        return;
    }
    await roomService.createRoom(request.body.title,request.user.name,request.user._id);
    let rooms = await roomService.readRoomList();
    response.send({
        status: true,
        rooms
    });
};

exports.deleteRoom=async function (request, response) {

    if (!request.isAuthenticated()) {
        response.send({
            status: false,
            reason: "please Login",
        });
        return;
    }

    let room = await roomService.readRoom(request.body.roomId);
    if (room.ownerId != request.user._id) {       
        response.send({
            status: false,
            reason: "not Owner",
        });
        return;
    }

    let deleteFlag=await roomService.deleteRoom(request.body.roomId);
    if(!deleteFlag){
        response.send({
            status: false,
            reason: "cannot find room",
        });
        return;
    }

    let rooms = await roomService.readRoomList();
    response.send({
        status: true,
        rooms,
    });
};