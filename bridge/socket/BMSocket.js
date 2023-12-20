const ClientSocket = require('../../common/socket/ClientSocket');
const SocketManager = require('../../common/manager/SocketManager');
const config = require('../../common/config');

module.exports = class BMSocket extends ClientSocket {
    constructor(server) {
        super(server);
        this.bind();
    }

    bind = () => {
        this.socket.on('connect', () => {
            console.log('*** Connected to Main Service ***');
            this.updateState(true);
        });

        this.socket.on('disconnect', () => {
            console.log('### Disconnected from Main Service ###');
        });
    }

    updateState = (isFirst = false) => {
        let data = {};
        let shard = config.SERVICE[global.options.name];

        if(isFirst) {
            data.shard = shard.NAME;
            data.host = shard[global.options.number].HOST;
            data.port = shard[global.options.number].PORT;
        }

        let server_socket = SocketManager.getInstance().getServerSocket();
        data.client_count = (server_socket === null) ? 0 : server_socket.getEndPoints().length;

        this.send('update_bridge', data);
    }
}