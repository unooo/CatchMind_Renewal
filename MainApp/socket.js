const socketIo = require('socket.io');
let passportSocketIo = require("passport.socketio");

module.exports = (server, app, sessionStore, cookieParser) => {
  const io = socketIo(server, { path: '/socket.io' });
  app.set('io', io);
  //결론적으로 socket.request 에서 .user로 passport엣서 사용하는 세션을 사용하게해준다
  io.use(passportSocketIo.authorize({
    cookieParser: cookieParser,       // the same middleware you registrer in express
    key: 'express.sid',       // the name of the cookie where express/connect stores its session_id
    secret: 'asadlfkj!@#!@#dfgasdg',    // the session_secret to parse the cookie
    store: sessionStore,        // we NEED to use a sessionstore. no memorystore please
    success: onAuthorizeSuccess,  // *optional* callback on success - read more below
    fail: onAuthorizeFail,     // *optional* callback on fail/error - read more below
  }));

  const NameSpaceIo_Chat = io.of('/chat');
  const NameSpaceIO_Draw = io.of('/game');
  const NameSpace_Chat=require('./socket_namespace/ChatSpace');
  const NameSpace_Draw=require('./socket_namespace/DrawSpace');

  NameSpaceIo_Chat.on('connection', (socket)=>NameSpace_Chat(socket,NameSpaceIo_Chat) );
  NameSpaceIO_Draw.on('connection',(socket)=>NameSpace_Draw(socket,NameSpaceIO_Draw) );

  function onAuthorizeSuccess(data, accept) {
    console.log('successful connection to socket.io');
    // The accept-callback still allows us to decide whether to
    // accept the connection or not.
    accept(null, true);
  }

  function onAuthorizeFail(data, message, error, accept) {
    if (error)
      throw new Error(message);
    console.log('failed connection to socket.io:', message);
    // We use this callback to log all of our failed connections.
    accept(null, false);
  }

  return io;
}