let roomService = require("../service/RoomService");

exports.getIndex=async function (request, response) {   
      let rooms = await roomService.readRoomList();
      let user = null;
      if (request.isAuthenticated()) {
        user = request.user;
      }else{
          //todo - > 이 로직 중복 예상, 서비스 별 미들웨어 구분해서 적용 할 것
      }
      response.render('main', { rooms, user });    
  }