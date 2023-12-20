const config = require('../common/config');
const CommandProcessor = require('../common/manager/CommandProcessor');
const SocketManager = require('../common/manager/SocketManager');
const SyncSocket = require('./socket/SyncSocket');

let options = CommandProcessor.process(process.argv);
if(options.name === undefined) {
    console.error({title: 'Invalid parameters', message: 'Please check run command in package.json'});
    process.exit();
}

let shard = config.SERVICE[options.name];

const app = require('../common/app').createApp(shard.SYNC.PORT);
const server = SocketManager.getInstance().createServer(app, SyncSocket);

server.listen(shard.SYNC.PORT, () => {
    console.log('Sync Service is started on ' + shard.SYNC.PORT + ' port');
});