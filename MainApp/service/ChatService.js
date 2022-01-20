let ChatRepository = require('../repository/chat');

exports.createChat = async function({roomId,userId,chat}){
    let chatModel = await ChatRepository.create({roomId,userId,chat});
    return chatModel;
}

exports.readChatByRoomId=async function (roomId) {
    let chats = await ChatRepository.find({roomId });
    return chats;
}


