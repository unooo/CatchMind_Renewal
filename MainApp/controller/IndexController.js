let roomService = require("../service/RoomService");
const wrap = require('../lib/wrap');
const AuthenticateError= require('../exception/AuthenticateError');
exports.getIndex=wrap(async function (request, response) {   
      if (!request.isAuthenticated()) {
        throw new AuthenticateError("please login");
      }
      let rooms = await roomService.readRoomList();
      let user = request.user;
     
      response.status(200).render('main', { rooms, user });    
  });