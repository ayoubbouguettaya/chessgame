const socketIO = require('socket.io');

const httpServer = require("http").createServer();

const io = socketIO(httpServer, {
    cors: {
        origin: process.env.CORS_ENDPOINT,
        credentials: true
    }
});

httpServer.listen(5001);
    
module.exports = io;