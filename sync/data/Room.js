const { LOAD_TIME } = require("../../common/constant");
const SocketManager = require("../../common/manager/SocketManager");
const GamePlayer = require("./GamePlayer");

module.exports = class Room {
    id = null;
    players = [];

    constructor(id) {
        this.id = id;
    }

    addPlayers = (players) => {
        players.forEach(player => {
            this.players.push(new GamePlayer(player));
        });
    }

    notifyStartGame = () => {
        const server_socket = SocketManager.getInstance().getServerSocket();
        if(server_socket !== null)
            server_socket.broadCast('StartMatch', {roomId: this.id, loadTime: LOAD_TIME, players: this.players});
    }
}