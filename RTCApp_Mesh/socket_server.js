let roomToUsers = {};
let socketIdToRoom = {};
const maximum = process.env.MAXIMUM || 4;
module.exports=(socket,io)=>{

    socket.on('join_room',  (data,cb) => {
        if (roomToUsers[data.room]) {
            const length = roomToUsers[data.room].length;
            if (length === maximum) {
                socket.to(socket.id).emit('room_full');
                return;
            }
            roomToUsers[data.room].push({id: socket.id, email: data.email});
        } else {
            roomToUsers[data.room] = [{id: socket.id, email: data.email}];
        }
        socketIdToRoom[socket.id] = data.room;

        socket.join(data.room);
        console.log(`[${socketIdToRoom[socket.id]}]: ${socket.id} enter`);

        const usersInThisRoom = roomToUsers[data.room].filter(user => user.id !== socket.id);
        console.log('userInThisRoom:');
        console.log(usersInThisRoom);
        io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
        if(cb)
        cb({status:"ok"});
    });

    socket.on('offer', (data,cb) => {
        socket.to(data.offerReceiveID).emit('getOffer', {sdp: data.sdp, offerSendID: data.offerSendID, offerSendEmail: data.offerSendEmail});
        if(cb)
         cb({status:"ok"});
    });

    socket.on('answer', (data,cb) => {
        socket.to(data.answerReceiveID).emit('getAnswer', {sdp: data.sdp, answerSendID: data.answerSendID});
        if(cb)
         cb({status:"ok"});
    });

    socket.on('candidate', (data,cb) => {
        socket.to(data.candidateReceiveID).emit('getCandidate', {candidate: data.candidate, candidateSendID: data.candidateSendID});
        if(cb)
         cb({status:"ok"});
    })
    socket.on('offerDisconnected', (data,cb) => {        
        const roomID = socketIdToRoom[socket.id];
        let offerUser= roomToUsers[roomID].filter(user => user.id == socket.id)[0];
        socket.to(data.offerSendAnswerId).emit('offerDisconnected', {offerUser:offerUser,retryNum:data.retryNum});
        console.log('offerDisconnected : ');
        console.log(offerUser);
        if(cb)
         cb({status:"ok"});
    })

    socket.on('disconnect', () => {
        console.log(`[${socketIdToRoom[socket.id]}]: ${socket.id} exit`);
        const roomID = socketIdToRoom[socket.id];
        let room = roomToUsers[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            roomToUsers[roomID] = room;
            if (room.length === 0) {
                delete roomToUsers[roomID];
                return;
            }
        }
        socket.to(roomID).emit('user_exit', {id: socket.id});
        console.log(`disconnected: ${roomToUsers}`);
    });
    return {
        roomToUsers,
        socketIdToRoom,        
    }
}