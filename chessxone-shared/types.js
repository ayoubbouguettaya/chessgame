"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimerType = exports.GameStatus = exports.EndedBy = void 0;
var EndedBy;
(function (EndedBy) {
    EndedBy["DRAW"] = "DRAW";
    EndedBy["RESIGN"] = "RESIGN";
    EndedBy["CHECK_MATE"] = "CHECK_MATE";
    EndedBy["STEAL_MATE"] = "STEAL_MATE";
    EndedBy["TIME_OUT"] = "TIME_OUT";
    EndedBy["LEAVE_OUT"] = "LEAVE_OUT";
})(EndedBy = exports.EndedBy || (exports.EndedBy = {}));
var GameStatus;
(function (GameStatus) {
    GameStatus["loading"] = "LOADING";
    GameStatus["running"] = "RUNNING";
    GameStatus["ended"] = "ENDED";
    GameStatus["not_available"] = "NOT_AVAILABLE";
})(GameStatus = exports.GameStatus || (exports.GameStatus = {}));
var TimerType;
(function (TimerType) {
    TimerType["_10minPerPlayer"] = "10MIN_PER_PLAYER";
    TimerType["_5minPerPlayer"] = "5MIN_PER_PLAYER";
    TimerType["_1minPerTurn"] = "1MIN_PER_TURN";
})(TimerType = exports.TimerType || (exports.TimerType = {}));
