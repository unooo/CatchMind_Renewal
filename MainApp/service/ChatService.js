let ChatRepository = require('../repository/chat');

exports.readChatByRoomId=async function (roomId) {
    let chats = await ChatRepository.find({ room: roomId });
    return chats;
}

exports.createChat = async function(room,user,chat){
    let chatModel = await ChatRepository.create({room,user,chat});
    return chatModel;
}
