const ClientSocket = require('../../common/socket/ClientSocket');
const SocketManager = require('../../common/manager/SocketManager');
const config = require('../../common/config');
const BMSocket = require('./BMSocket');

module.exports = class BSSocket extends ClientSocket {
    constructor(server) {
        super(server);
        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log('*** Connected to Sync Service ***');
            SocketManager.getInstance().connectToServer(config.SERVICE.MAIN.HOST, BMSocket);
        });

        this.socket.on('disconnect', () => {
            console.log('### Disconnected from Sync Service ###');
        });
    }
}