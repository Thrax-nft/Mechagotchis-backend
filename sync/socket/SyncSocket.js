const ServerSocket = require('../../common/socket/ServerSocket');
const SyncProcessor = require('../processor/SyncProcessor');

module.exports = class SyncSocket extends ServerSocket {
    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            this.addEndPoint(this.getEndPoints().length + 1, client.id, {type: 'Bridge'});
            console.log(`*** Bridge service is connected from ${client.id} ***`);

            client.on('disconnect', () => {
                this.removeEndPoint(client.id);
                console.log(`### Bridge service is disconnected from ${client.id} ###`);
            });

            client.on('StartSync', (data) => {
                let newRoom = SyncProcessor.getInstance().addRoom(data.roomId);
                if(newRoom === null)
                    return;
                
                newRoom.addPlayers(data.players);
                newRoom.notifyStartGame();
            });
        });
    }
}