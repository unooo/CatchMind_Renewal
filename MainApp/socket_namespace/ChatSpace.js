let chatService = require('../service/ChatService');
let ChatDTO_Create = require('../dto/ChatDTO_Create');
module.exports = (socket,io)=>{
    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    //socket에서 꺼낸 request에서는 아래와 같이 접근해야 세션정보꺼냄
    console.debug(socket.requset);
    const myName = socket.request.user.name;
    console.log("chat space 신규 접속", ip, socket.id, myName);
    const splitUrl = req.headers.referer.split('/');
    const roomId = splitUrl[splitUrl.length - 1];
    socket.join(roomId);
    let chats = chatService.readChatByRoomId(roomId);

    socket.broadcast.to(roomId).emit("newJoin", myName, chats);

    socket.on('chat', async function (id, message) {
      await chatService.createChat(new ChatDTO_Create(roomId,id,message));      
      io.to(roomId).emit('chat', id, message);
    });

    socket.on('disconnect', () => {
      console.log('client out', ip, socket.id);
      socket.leave(roomId);
    });

    socket.on('error', (error) => {
      console.error(error);
    })

  }