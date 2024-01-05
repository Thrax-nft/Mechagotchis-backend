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

        this.socket.on('UpdateGame', (data) => {
            let server_socket = SocketManager.getInstance().getServerSocket();
            if(server_socket === null)
                return;

            server_socket.broadCast('UpdateGame', JSON.stringify(data));
        });

        this.socket.on('UpdateGameState', (data) => {
            let server_socket = SocketManager.getInstance().getServerSocket();
            if(server_socket === null)
                return;

            for(let index = 0; index < data.players.length; index++) 
                server_socket.sendToEndPoint(data.players[index], 'UpdateGameState', JSON.stringify({roomId: data.roomId, joiners: data.state}));
        });

        this.socket.on('StartSync', (data) => {
            const BS_Socket = SocketManager.getInstance().getClientSocket('BSSocket');
            if(BS_Socket === null)
                return;

            BS_Socket.send('StartSync', data);
        }); 
    }
}