const config = require('../common/config');
const CommandProcessor = require('../common/manager/CommandProcessor');
const SocketManager = require('../common/manager/SocketManager');
const BridgeSocket = require('./socket/BridgeSocket');
const BGSocket = require('./socket/BGSocket');

global.options = CommandProcessor.process(process.argv);
if(global.options.name === undefined || global.options.number === undefined) {
    console.error({title: 'Invalid parameters', message: 'Please check run command in package.json'});
    process.exit();
}

let shard = config.SERVICE[global.options.name];

const app = require('../common/app').createApp(shard[global.options.number].PORT);
const server = SocketManager.getInstance().createServer(app, BridgeSocket);

server.listen(shard[global.options.number].PORT, () => {
    console.log('Bridge Service is started on ' + shard[global.options.number].PORT + ' port');

    SocketManager.getInstance().connectToServer(shard.GAME.HOST, BGSocket);
});