const { TestWatcher } = require("jest");
const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
let my_socket_server = require('../socket_server');
let temp = 0;
let connect_complete_socket_num = 0;
function checkConnect(done) {
  connect_complete_socket_num++;
  if (connect_complete_socket_num == 2)
    done();
}
describe("Signal Server Socket Test", () => {
  let clientSocketAry = new Array(3);
  let io, clientSocket_A, clientSocket_B, clientSocket_C;
  let serverSockets = {};
  let my_socket_server_ret;
  beforeAll((done) => {
    const httpServer = createServer();
    io = new Server(httpServer);
    httpServer.listen(() => {
      const port = httpServer.address().port;
      io.on("connection", (socket) => {
        serverSockets[socket.id] = socket;
        my_socket_server_ret = my_socket_server(socket, io);
      });
      for(let i=0;i<3;i++){
        clientSocketAry[i] = new Client(`http://localhost:${port}`);
        clientSocketAry[i].on("connect", () => {
          checkConnect(done);
        });
      }
      [clientSocket_A, clientSocket_B, clientSocket_C] = clientSocketAry;
    });
  });

  afterAll(() => {
    io.close();
    clientSocket_A.close();
    clientSocket_B.close();
    jest.resetModules();
  });

  test("join_room test", (done) => {
    //given
    const room1 = "room-1";
    const room2 = "room-2";
    clientSocket_A.emit("join_room", { room: room1, email: 'test1@naver.com' });
    clientSocket_A.emit("join_room", { room: room2, email: 'test2@naver.com' });
    clientSocket_A.emit("join_room", { room: room1, email: 'test2@naver.com' }, arg => {
      expect(my_socket_server_ret.roomToUsers[room1].length).toBe(2);
      expect(my_socket_server_ret.roomToUsers[room2].length).toBe(1);
      done();
    });
  });

  test("offer test", (done) => {
    clientSocket_B.on("getOffer", data => {
      expect(data.offerSendID).toBe(clientSocket_A.id);
      done();
    });
    clientSocket_A.emit("offer", { offerSendID: clientSocket_A.id, offerReceiveID: clientSocket_B.id });
  })

  test("answer test", (done) => {
    clientSocket_B.on("getAnswer", data => {
      expect(data.answerSendID).toBe(clientSocket_A.id);
      done();
    });
    clientSocket_A.emit("answer", { answerSendID: clientSocket_A.id, answerReceiveID: clientSocket_B.id });
  })

  test("candidate test", (done) => {
    clientSocket_B.on("getCandidate", (data) => {
      expect(data.candidateSendID).toBe(clientSocket_A.id);
      done();
    });
    clientSocket_A.emit("candidate", { candidateSendID: clientSocket_A.id, candidateReceiveID: clientSocket_B.id });
  });

  test("offerDisconnected test", (done) => {
    const room1 = "room-1";
    const room2 = "room-2";
    my_socket_server_ret.socketIdToRoom[clientSocket_A.id]=room1;
    my_socket_server_ret.socketIdToRoom[clientSocket_B.id]=room2;
    my_socket_server_ret.socketIdToRoom[clientSocket_C.id]=room1;
    my_socket_server_ret.roomToUsers[room1].push(clientSocket_A.id);
    my_socket_server_ret.roomToUsers[room2].push(clientSocket_B.id);
    my_socket_server_ret.roomToUsers[room1].push(clientSocket_C.id);
    clientSocket_C.on("offerDisconnected", data => {
      expect(data.offerUser.id).toBe(clientSocket_A.id);
      done();
    });
    clientSocket_A.emit("offerDisconnected", { offerSendId: clientSocket_A.id, offerSendAnswerId: clientSocket_C.id });
  });

  test("Example : should work", (done) => {
    clientSocket_A.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSockets[clientSocket_A.id].emit("hello", "world");
  });

  test("Example : should work (with ack)", (done) => {
    serverSockets[clientSocket_A.id].on("hi", (cb) => {
      cb("hola");
    });
    clientSocket_A.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });

  beforeEach(() => {
    temp = 1;
  });

  test('tmep is 1', () => {
    expect(temp).toBe(1); // true
  });
  afterEach(() => {
    temp = 0;
  });
})