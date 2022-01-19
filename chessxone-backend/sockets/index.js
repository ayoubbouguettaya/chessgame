const io = require('../config/socketIO-instance');

const eventHandler = require('./eventHandler')
const middleware = require('./middleware');

module.exports = () => {
    io.use(middleware)
    io.on('connection', (socket) => {
        eventHandler(socket)
    })
}
