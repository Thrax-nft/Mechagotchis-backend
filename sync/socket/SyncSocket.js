const ServerSocket = require('../../common/socket/ServerSocket');

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
        });
    }
}