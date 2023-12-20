const ServerSocket = require('../../common/socket/ServerSocket');

module.exports = class MainSocket extends ServerSocket {
    constructor(server) {
        super(server);

        this.bind();
    }

    bind = () => {
        this.listen_socket.on('connection', (client) => {
            console.log(`*** Bridge service is connected from ${client.id} ***`);

            client.on('disconnect', () => {
                this.removeEndPoint(client.id);
                console.log(`### Bridge service is disconnected from ${client.id} ###`);
            });

            client.on('update_bridge', (data) => {
                if(data.hasOwnProperty('shard') && data.hasOwnProperty('host') && data.hasOwnProperty('port')) {
                    let bridge_data = {shard: data.shard, host: data.host, port: data.port, clients: 0};
                    this.addEndPoint(this.getEndPoints().length + 1, client.id, bridge_data);
                }
                else {
                    let bridge_service = this.getEndPointBySocket(client.id);
                    if(bridge_service === null)
                        return;

                    let bridge_data = bridge_service.data;
                    bridge_data.clients = data.client_count;
                    this.updateEndPoint(client.id, bridge_data);
                }
            });
        });
    }

    getBestBridge = () => {
        let servers = this.getEndPoints();
        return (servers.length === 0) ? null : servers[0].data.host;
    }
}