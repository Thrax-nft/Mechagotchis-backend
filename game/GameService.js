const config = require('../common/config');
const CommandProcessor = require('../common/manager/CommandProcessor');
const SocketManager = require('../common/manager/SocketManager');
const GameSocket = require('./socket/GameSocket');

let options = CommandProcessor.process(process.argv);
if(options.name === undefined) {
    console.error({title: 'Invalid parameters', message: 'Please check run command in package.json'});
    process.exit();
}

global.shard = config.SERVICE[options.name];

const app = require('./GameApp').createApp(global.shard.GAME.PORT, config.DB);
const server = SocketManager.getInstance().createServer(app, GameSocket);

server.listen(global.shard.GAME.PORT, () => {
    console.log('Game Service is started on ' + global.shard.GAME.PORT + ' port');
});