let express = require('express');
const spdy = require('spdy');
let app = express();
let fs = require('fs');
var options = {
    key: fs.readFileSync('www.unoo.kro.kr-key.pem'),
    cert: fs.readFileSync('www.unoo.kro.kr-crt.pem'),
    ca: fs.readFileSync('www.unoo.kro.kr-chain.pem'),
    requestCert: false,
    rejectUnauthorized: false,
};
let cors = require('cors');
app.use(cors());

const httpServer = spdy.createServer(options, app);
const { Server } = require("socket.io");
const io = new Server(httpServer,{ 
    path: '/socket.io' ,
    cors:{
        origin: ['https://www.unoo.kro.kr','https://www.unoo.kro.kr:3001','https://www.unoo.kro.kr:443'],    
    },    
    transports:["websocket","polling"],
    allowEIO3: true, // false by default
});

const PORT = process.env.PORT || 3001;

app.get('/', function (request, response) {
    response.send("RTC Signaling Server is open");
})

let my_socket_server = require('./socket_server');
io.on('connection',(socket)=>{
    my_socket_server(socket,io);
} );

httpServer.listen(PORT, () => {
    console.log(`server running on ${PORT}`);
});