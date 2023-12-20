module.exports = class SocketManager {
    static _instance = null;

    server_socket = null;
    client_sockets = [];

    static getInstance = () => {
        if(SocketManager._instance === null)
            SocketManager._instance = new SocketManager();

        return SocketManager._instance;
    }

    constructor() {

    }

    createServer = (app, ServerSocketClass) => {
        const server = require('http').createServer(app);
        this.server_socket = new ServerSocketClass(server);
        return server;
    }

    connectToServer = (server, ClientSocketClass) => {
        this.client_sockets.push(new ClientSocketClass(server));
    }

    getServerSocket = () => {
        return this.server_socket;
    }

    getClientSocket = (ClientSocketClass) => {
        const index = this.client_sockets.findIndex(client => client.constructor.name === ClientSocketClass);
        return (index >= 0) ? this.client_sockets[index] : null;
    }

    test = () => {
        for(let i = 0; i < this.client_sockets.length; i++) {
            console.log(this.client_sockets[i].constructor.name);
        }
    }
}