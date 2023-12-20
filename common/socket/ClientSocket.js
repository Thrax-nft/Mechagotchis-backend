module.exports = class ClientSocket {
    socket = null;

    constructor(server) {
        this.socket = require('socket.io-client').connect(server);
    }

    send = (packetName, packetData) => {
        if(!this.socket.connected)
            return;

        this.socket.emit(packetName, packetData);
    }

    call = (packetName, packetData, callback) => {
        if(!this.socket.connected)
            return;

        this.socket.emit(packetName, packetData, (response) => {
            return callback(response);
        });
    }
}