let ChatRepository = require('../repository/chat');

exports.createChat = async function({room,user,chat}){
    let chatModel = await ChatRepository.create({room,user,chat});
    return chatModel;
}

exports.readChatByRoomId=async function (roomId) {
    let chats = await ChatRepository.find({roomId });
    return chats;
}


