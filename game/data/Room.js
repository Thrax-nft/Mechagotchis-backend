const { RandomString } = require("../../common/Utility");
const { GAME_MODE, GAME_STATE, GAME_PLAYER_STATE } = require("../../common/constant");
const SocketManager = require("../../common/manager/SocketManager");
const GamePlayer = require("./GamePlayer");

module.exports = class Room {
    id = null;
    hostName = null;
    mode = null;
    code = null;
    server = null;
    owner = null;
    joiners = null;
    state = null;

    constructor(id, owner) {
        this.id = id;
        this.hostName = owner.name + "'s LOBBY";
        this.mode = GAME_MODE.SOLO_BR;
        this.code = RandomString();
        this.server = global.shard.NAME;
        this.owner = new GamePlayer(owner.id, owner.name, owner.wallet, GAME_PLAYER_STATE.READY);
        this.joiners = [null, null, null, null, null, null, null, null, null];
        this.state = GAME_STATE.PREPARE;
    }

    isOwner = (playerId) => {
        return this.owner !== null && this.owner.id === playerId;
    }

    isJoiner = (playerId) => {
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] !== null && this.joiners[index].id === playerId)
                return true;
        }

        return false;
    }

    addJoiner = (player) => {
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] == null) {
                this.joiners[index] = new GamePlayer(player.id, player.name, player.wallet, GAME_PLAYER_STATE.NOT_READY);
                return index;
            }
        }

        return -1;
    }

    removeJoiner = (playerId) => {
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] !== null && this.joiners[index].id === playerId) {
                this.joiners[index] = null;
                return;
            }
        }
    }

    confirmReady = (playerId) => {
        let result = false;
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] !== null && this.joiners[index].id === playerId) {
                this.joiners[index].state = GAME_PLAYER_STATE.READY;
                result = true;
                break;
            }
        }

        if(result)
            this.notifyUpdatedState();

        return result;
    }

    Confirmed = (playerId) => {
        let result = false;
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] !== null && this.joiners[index].id === playerId) {
                this.joiners[index].state = GAME_PLAYER_STATE.NOT_READY;
                result = true;
                break;
            }
        }

        if(result)
            this.notifyUpdatedState();

        return result;
    }

    startMatch = () => {
        let result = false;
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] === null)
                continue;

            if(this.joiners[index].state === GAME_PLAYER_STATE.READY)
                result = true;
            else
                result = false;
        }

        if(result)
            this.state = GAME_STATE.STARTED;

        return result;
    }

    notifyUpdatedState = () => {
        let players = [this.owner.id];
        for(let index = 0; index < this.joiners.length; index++) {
            if(this.joiners[index] !== null) {
                players.push(this.joiners[index].id);
            }
        }

        const server_socket = SocketManager.getInstance().getServerSocket();
        if(server_socket !== null)
            server_socket.broadCast('UpdateGameState', {players: players, roomId: this.id, state: this.joiners});
    }
}