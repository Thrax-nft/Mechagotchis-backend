const SocketManager = require('../../common/manager/SocketManager');
const ServerSocket = require('../../common/socket/ServerSocket');

module.exports = class BridgeSocket extends ServerSocket {

    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            console.log(`*** client is connected from ${client.id} ***`);

            client.emit('RequestVerify', '');

            client.on('disconnect', () => {
                console.log(`### client is disconnected from ${client.id} ###`);

                let id = this.removeEndPoint(client.id);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('LogoutPlayer', {userId: id}, (response) => {
                    if(!response)
                        return;

                    const BM_Socket = SocketManager.getInstance().getClientSocket('BMSocket');
                    if(BM_Socket !== null)
                        BM_Socket.updateState();
                });
            });

            client.on('ConfirmVerify', async(request) => {
                let data = JSON.parse(request);

                this.addEndPoint(data.userId, client.id, null);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('NewPlayer', data, (response) => {
                    if(!response.status)
                        return;

                    const BM_Socket = SocketManager.getInstance().getClientSocket('BMSocket');
                    if(BM_Socket !== null)
                        BM_Socket.updateState();

                    client.emit('ConfirmVerify', '');
                });
            });

            client.on('UpdateWeapons', (request) => {
                let data = JSON.parse(request);
                
                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.send("UpdateWeapons", data); 
            });
        });
    }
}