const User = require('../../api/models/user');
const UserOnRedis = require('../../redisAccess/user');
const UserGameRequestOnRedis = require('../../redisAccess/userGameRequest')
const UserGamesInvitationsOnRedis = require('../../redisAccess/userGamesInvitation')


const connectAndgetUserData = async (userID) => {
    try {
        const userInfo = await User.findById(userID, 'userName tagID picture').lean();
        const lastTimeConnected = new Date();
        const dataToStore = {
            ...userInfo,
            _id: userID,
            isConnected: true,
            isLocked: false,
            isPlaying: false,
            lastTimeConnected
        };
        UserOnRedis.set(userID,dataToStore)
        
        return dataToStore;
    }
    catch (error) {
        return error;
    }
}

const disconnect = async (userID) => {
    try {
        return await UserOnRedis.setIsConnected(userID, false)
    } catch (error) {
        return error;
    }
}

const getConnectedFriends = async (userID) => {
    try {
        const user = await User.findById(userID, 'connections').lean();

        if (!user) {

            return []
        }
        const { connections } = user;

        return await UserOnRedis.getOnlyConnectedUsersData(connections);
    } catch (error) {
        return error;
    }
}

const getData = async (userID) => {
    try {
        const userInfoInCache = await UserOnRedis.get(userID)

        if (!userInfoInCache) {
            return await User.findById(userID, 'userName tagID picture').lean();
        }

        return userInfoInCache;
    } catch (error) {
        return error
    }
}

/* User Game */

const getUserGameRequest = async (userID) => {
    try {
        return await UserGameRequestOnRedis.get(userID);
    } catch (error) {
        return error
    }
}

const getUserGamesInvitations = async (userID) => {
    try {
        return await UserGamesInvitationsOnRedis.get(userID);
    } catch (error) {
        return error
    }
}

const isAllowedToRequestGame = async (hosterID, guestID) => {
    try {
        if (hosterID === guestID) {
            return false;
        }
        const userGameInvitationSet = await UserGamesInvitationsOnRedis.get(hosterID)
        const guestUserGameInvitationSet = await UserGamesInvitationsOnRedis.get(guestID)

        if (guestUserGameInvitationSet.includes(hosterID)) {
            return false
        }

        if (userGameInvitationSet.includes(guestID)) {
            return false
        }

        const userGameRequestInfo = await UserGameRequestOnRedis.get(hosterID);
        if (userGameRequestInfo) {
            return false;
        }

        return true;
    } catch (error) {
        return error;
    }
}

const isAllowedToApproveGame = async (guestID, hosterID) => {
    try {
        const userGameRequestInfo = await UserGameRequestOnRedis.get(hosterID)

        if (!userGameRequestInfo) {
            await UserGamesInvitationsOnRedis.pull(guestID, hosterID)
            return false;
        }

        if (userGameRequestInfo.opponentID !== guestID) {
            return false;
        }

        const guestGameInvitationsSet = await UserGamesInvitationsOnRedis.get(guestID)
        if (!guestGameInvitationsSet.includes(hosterID)) {
            return false;
        }

        return true;
    } catch (error) {
        return error;
    }
}

const requestGame = async (hosterID, guestID) => {
    try {
        await UserGameRequestOnRedis.set(hosterID, guestID)

        await UserGamesInvitationsOnRedis.push(guestID, hosterID)
        await UserOnRedis.setIsLocked(hosterID, true);

        const playerToNotifyGameCancled = await UserGamesInvitationsOnRedis.get(hosterID)

        if (playerToNotifyGameCancled) {
            UserGamesInvitationsOnRedis.clear(hosterID)
            for (let i = 0; i < playerToNotifyGameCancled.length; i++) {
                await UserGameRequestOnRedis.clear(playerToNotifyGameCancled[i])
            }
        }

        return playerToNotifyGameCancled;

    } catch (error) {
        return error;
    }
}

const prepareCreateGame = async (guestID, hosterID) => {
    try {
        await UserGameRequestOnRedis.clear(hosterID)
        await UserOnRedis.setIsLocked(guestID, true);

        const playerToNotifyGameCancled = await UserGamesInvitationsOnRedis.get(guestID)

        if (playerToNotifyGameCancled) {
            UserGamesInvitationsOnRedis.clear(guestID)
            for (let i = 0; i < playerToNotifyGameCancled.length; i++) {
                await UserGameRequestOnRedis.clear(playerToNotifyGameCancled[i])
            }
        }

        return playerToNotifyGameCancled;
    } catch (error) {
        return error;
    }
}

const joinGame = async (userID, gameInfo) => {
    try {
        await UserOnRedis.setGame(userID, gameInfo);
        await UserOnRedis.setIsLocked(true)
        await UserOnRedis.setIsPlaying(true)
    } catch (error) {
        return error;
    }
}

const getGameID = async (userID) => {
    try {
        const { gameID = '' } = await UserOnRedis.get(userID, gameInfo);
        return gameID
    } catch (error) {
        return error;
    }
}

const leaveGame = async (userID) => {
    try {
        await UserOnRedis.setIsLocked(userID, false);
        await UserOnRedis.setIsPlaying(userID, false);
        return await UserOnRedis.removeGameID(userID)
    } catch (error) {
        return error;
    }
}

module.exports = {
    connectAndgetUserData,
    disconnect,
    getConnectedFriends,
    getData,
    getUserGameRequest,
    getUserGamesInvitations,
    isAllowedToRequestGame,
    isAllowedToApproveGame,
    requestGame,
    prepareCreateGame,
    joinGame,
    getGameID,
    leaveGame
}