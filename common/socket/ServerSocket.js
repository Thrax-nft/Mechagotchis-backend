module.exports = class ServerSocket {
    listen_socket = null;
    client_sockets = [];

    constructor(server) {
        this.listen_socket = require('socket.io')({
            cors: {
                origin: '*',
                method: ['GET', 'POST']
            }
        }).listen(server);
    }

    addEndPoint = (id, socket, data) => {
        if(!id || this.getEndPoint(id) !== null)
            return;

        this.client_sockets.push({id, socket, data});
    }

    updateEndPoint = (socket, data) => {
        let endPoint = this.getEndPointBySocket(socket);
        if(!endPoint)
            endPoint.data = data;
    }

    getEndPoint = (id) => {
        const index = this.client_sockets.findIndex(client => client.id === id);
        return (index >= 0) ? this.client_sockets[index] : null;
    }

    getEndPointBySocket = (socket) => {
        const index = this.client_sockets.findIndex(client => client.socket === socket);
        return (index >= 0) ? this.client_sockets[index] : null;
    }

    getEndPoints = () => {
        return this.client_sockets;
    }

    removeEndPoint = (socket) => {
        const index = this.client_sockets.findIndex(client => client.socket === socket);
        let id = (index >= 0) ? this.client_sockets[index].id : null;
        if(index >= 0)
            this.client_sockets.splice(index, 1);

        return id;
    }

    sendToEndPoint = (id, packetName, packetData) => {
        let endpoint = this.getEndPoint(id);
        if(!endpoint)
            return;

        this.listen_socket.to(endpoint.socket).emit(packetName, packetData);
    }

    broadCast = (packetName, packetData) => {
        this.listen_socket.emit(packetName, packetData);
    }
}