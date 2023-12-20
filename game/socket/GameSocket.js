const ServerSocket = require('../../common/socket/ServerSocket');
const PlayerProcessor = require('../processor/PlayerProcessor');

module.exports = class GameSocket extends ServerSocket {
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

            client.on('NewPlayer', async(data, callback) => {
                let result = await PlayerProcessor.getInstance().addPlayer(data.userId);
                return callback(result);
            });

            client.on('LogoutPlayer', (data, callback) => {
                let result = PlayerProcessor.getInstance().removePlayer(data.userId);
                return callback(result);
            });

            client.on('UpdateWeapons', (data) => {
                PlayerProcessor.getInstance().updatePlayerWeapons(data);
            });
        });
    }
}