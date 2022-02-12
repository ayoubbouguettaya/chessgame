/* 
this module is using socket.io instance to emit some Event in Reaction to Rest Api Request and handling
*/
const notify = require("./unicast");
const notifyAll = require("./multicast");

module.exports = {
    notify,
    notifyAll
}