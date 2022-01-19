const eventListner = require('./eventListner')

module.exports = async (socket) => {
    eventListner.onConnexion(socket)
    eventListner.onDisconnect(socket)

    eventListner.onJoinGame(socket)
    eventListner.onAskRematch(socket)
    eventListner.onAcceptRematch(socket)

    eventListner.onMove(socket)
    eventListner.onPawnPromotion(socket)
    eventListner.onCastleKing(socket)

    eventListner.onClaimResign(socket)
    eventListner.onClaimTimeOut(socket)
    eventListner.onClaimCheckMate(socket)
    eventListner.onClaimStealMate(socket)
    eventListner.onOfferDraw(socket)
    eventListner.onLeaveGame(socket)
}