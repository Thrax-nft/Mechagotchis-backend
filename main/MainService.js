const config = require('../common/config');
const SocketManager = require('../common/manager/SocketManager');
const MainSocket = require('./socket/MainSocket');

const app = require('./MainApp').createApp(config.SERVICE.MAIN.PORT, config.DB);
const server = SocketManager.getInstance().createServer(app, MainSocket);
server.listen(config.SERVICE.MAIN.PORT, () => {
    console.log('Main Service is started on ' + config.SERVICE.MAIN.PORT + ' port');
});