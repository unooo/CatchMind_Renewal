module.exports=(socket) => {

    const req = socket.request;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const myName = socket.request.user.name;
    console.log("draw space 신규 접속", ip, socket.id, myName);
    const splitUrl = req.headers.referer.split('/');
    const roomId = splitUrl[splitUrl.length - 1];
    socket.join(roomId);

    socket.on('sendDraw', data => {
      console.log('sendDraw', data, roomId);
      //나를 제외한 룸의 에밋
      socket.broadcast.to(roomId).emit("receiveDraw", data);
      //나를 포함한 룸의 에밋
      // nameSpaceDraw.to(roomId).emit("receiveDraw",data);
    });

    socket.on('clearCanvas', () => {
      console.log('clear Canvas');
      //나를 제외한 룸의 에밋
      socket.broadcast.to(roomId).emit("clearCanvas");
    });

    socket.on('setColor', (data) => {
      console.log('Set Canvas Color' + data);
      //나를 제외한 룸의 에밋
      socket.broadcast.to(roomId).emit("setColor", data);
    });

    socket.on('disconnect', () => {
      console.log('client out', ip, socket.id);
      socket.leave(roomId);
    });

    socket.on('error', (error) => {
      console.error(error);
    });

  }