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

        this.socket.on('StartMatch', (data) => {
            let server_socket = SocketManager.getInstance().getServerSocket();
            if(server_socket === null)
                return;

            for(let index = 0; index < data.players.length; index++) 
                server_socket.sendToEndPoint(data.players[index].id, 'StartMatch', JSON.stringify({roomId: data.roomId, loadTime: data.loadTime}));
        });
    }
}