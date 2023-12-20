const ClientSocket = require('../../common/socket/ClientSocket');
const SocketManager = require('../../common/manager/SocketManager');
const config = require('../../common/config');
const BSSocket = require('./BSSocket');

module.exports = class BGSocket extends ClientSocket {
    constructor(server) {
        super(server);
        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log('*** Connected to Game Service ***');
            SocketManager.getInstance().connectToServer(config.SERVICE[global.options.name].SYNC.HOST, BSSocket);
        });

        this.socket.on('disconnect', () => {
            console.log('### Disconnected from Game Service ###');
        });
    }
}