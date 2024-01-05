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

            client.on('UpdateCharacter', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.send("UpdateCharacter", data); 
            });

            client.on('UpdateWeapons', (request) => {
                let data = JSON.parse(request);
                
                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.send("UpdateWeapons", data); 
            });

            client.on('EnterLobby', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('EnterLobby', data, (response) => {
                    client.emit('EnterLobby', JSON.stringify(response));
                });
            });

            client.on('LeaveLobby', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('LeaveLobby', data, (response) => {
                    client.emit('LeaveLobby', JSON.stringify(response));
                });
            });

            client.on('CreateGame', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('CreateGame', data, (response) => {
                    client.emit('CreateGame', JSON.stringify(response));
                });
            });

            client.on('LeaveGame', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('LeaveGame', data, (response) => {
                    client.emit('LeaveGame', JSON.stringify(response));
                });
            });

            client.on('GameSlots', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('GameSlots', data, (response) => {
                    client.emit('GameSlots', JSON.stringify(response));
                });
            });

            client.on('JoinGame', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('JoinGame', data, (response) => {
                    client.emit('JoinGame', JSON.stringify(response));
                });
            });

            client.on('ConfirmReady', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('ConfirmReady', data, (response) => {
                    client.emit('ConfirmReady', JSON.stringify(response));
                });
            });

            client.on('Confirmed', (request) => {
                let data = JSON.parse(request);

                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.call('Confirmed', data, (response) => {
                    client.emit('Confirmed', JSON.stringify(response));
                });
            });

            client.on('StartMatch', (request) => {
                let data = JSON.parse(request);
                const BG_Socket = SocketManager.getInstance().getClientSocket('BGSocket');
                if(BG_Socket === null)
                    return;

                BG_Socket.send("StartMatch", data); 
            });
        });
    }
}