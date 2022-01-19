const auth = require("./auth");
const cookie = require('cookie');

module.exports = async (socket, next) => {
  try {
    const cookies = cookie.parse(socket.request.headers.cookie || "");
    const sessionID = cookies.session;

    if (sessionID) {
      const userID = await auth.verifySession(sessionID);

      if (userID) {
        socket.userID = userID.toString();
        return next();
      }
    }
    
    return next(new Error("session_failed"))
  } catch (error) {
      return next(new Error("session_failed"))    
  }
}

