const { PLAYER_STATE, UPDATE_STATE } = require('../../common/constant');
const SocketManager = require('../../common/manager/SocketManager');
const ServerSocket = require('../../common/socket/ServerSocket');
const PlayerProcessor = require('../processor/PlayerProcessor');
const RoomProcessor = require('../processor/RoomProcessor');

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
                let result = await PlayerProcessor.getInstance().addPlayer(data.userId, client.id);
                return callback(result);
            });

            client.on('LogoutPlayer', (data, callback) => {
                let player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player)
                    return callback(false);

                if(player.hasGameRoom()) {
                    let room = RoomProcessor.getInstance().getRoom(player.room);
                    if(room.isOwner(player.id)) {
                        RoomProcessor.getInstance().removeRoom(room.id);
                        room.joiners.forEach(joiner => {
                            if(joiner !== null) {
                                const joinedPlayer = PlayerProcessor.getInstance().getPlayer(joiner.id);
                                if(joinedPlayer !== null) {
                                    joinedPlayer.room = null;
                                    joinedPlayer.state = PLAYER_STATE.LOBBY;
                                }
                            }
                        });
                        this.NotifyUpdatedGame(UPDATE_STATE.DELETE, room.id);
                    }
                    else {
                        room.removeJoiner(player.id);
                        this.NotifyUpdatedGame(UPDATE_STATE.UPDATE, room);
                    }
                }

                PlayerProcessor.getInstance().removePlayer(data.userId);
                return callback(true);
            });

            client.on('UpdateCharacter', (data) => {
                PlayerProcessor.getInstance().updatePlayerCharacter(data);
            });

            client.on('UpdateWeapons', (data) => {
                PlayerProcessor.getInstance().updatePlayerWeapons(data);
            });

            client.on('EnterLobby', (data, callback) => {
                let result = PlayerProcessor.getInstance().updatePlayerState(data.userId, PLAYER_STATE.LOBBY);
                return callback({status: result});
            });

            client.on('LeaveLobby', (data, callback) => {
                let result = PlayerProcessor.getInstance().updatePlayerState(data.userId, PLAYER_STATE.EQUIP);
                return callback({status: result});
            });

            client.on('CreateGame', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || player.hasGameRoom())
                    return callback({status: false});
                
                const room = RoomProcessor.getInstance().addRoom(player);
                if(!room)
                    return callback({status: false});

                player.room = room.id;
                let result = PlayerProcessor.getInstance().updatePlayerState(player.id, PLAYER_STATE.SLOT);

                this.NotifyUpdatedGame(UPDATE_STATE.CREATE, room);
                return callback({status: result, game: room});
            });

            client.on('LeaveGame', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || !player.hasGameRoom())
                    return callback({status: false});

                let room = RoomProcessor.getInstance().getRoom(player.room);
                if(room.isOwner(player.id)) {
                    RoomProcessor.getInstance().removeRoom(room.id);
                    room.joiners.forEach(joiner => {
                        if(joiner !== null) {
                            const joinedPlayer = PlayerProcessor.getInstance().getPlayer(joiner.id);
                            if(joinedPlayer !== null) {
                                joinedPlayer.room = null;
                                joinedPlayer.state = PLAYER_STATE.LOBBY;
                            }
                        }
                    });
                    this.NotifyUpdatedGame(UPDATE_STATE.DELETE, room.id);
                }
                else {
                    room.removeJoiner(player.id);
                    this.NotifyUpdatedGame(UPDATE_STATE.UPDATE, room);
                }

                player.room = null;
                let result = PlayerProcessor.getInstance().updatePlayerState(player.id, PLAYER_STATE.LOBBY);
                return callback({status: result});
            });

            client.on('GameSlots', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || player.state !== PLAYER_STATE.LOBBY)
                    return callback({status: false});

                return callback({status: true, games: RoomProcessor.getInstance().getPrepareRooms()});
            });

            client.on('JoinGame', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || player.hasGameRoom())
                    return callback({status: false});
                
                const room = RoomProcessor.getInstance().getRoom(data.gameId);
                if(!room)
                    return callback({status: false});

                let slotIndex = room.addJoiner(player);
                if(slotIndex === -1)
                    return callback({status: false});

                player.room = room.id;
                let result = PlayerProcessor.getInstance().updatePlayerState(player.id, PLAYER_STATE.SLOT);

                this.NotifyUpdatedGame(UPDATE_STATE.UPDATE, room);
                return callback({status: result, game: room});
            });

            client.on('ConfirmReady', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || !player.hasGameRoom())
                    return callback({status: false});
                
                const room = RoomProcessor.getInstance().getRoom(player.room);
                if(!room || !room.isJoiner(player.id))
                    return callback({status: false});

                let result = room.confirmReady(player.id);   
                return callback({status: result});
            });

            client.on('Confirmed', (data, callback) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || !player.hasGameRoom())
                    return callback({status: false});
                
                const room = RoomProcessor.getInstance().getRoom(player.room);
                if(!room || !room.isJoiner(player.id))
                    return callback({status: false});

                let result = room.Confirmed(player.id);   
                return callback({status: result});
            });

            client.on('StartMatch', (data) => {
                const player = PlayerProcessor.getInstance().getPlayer(data.userId);
                if(!player || !player.hasGameRoom())
                    return;
                
                const room = RoomProcessor.getInstance().getRoom(player.room);
                if(!room || !room.isOwner(player.id))
                    return;

                if(room.startMatch()) {
                    PlayerProcessor.getInstance().updatePlayerState(player.id, PLAYER_STATE.PLAY);
                    room.joiners.forEach(joiner => {
                        if(joiner !== null) {
                            const joinedPlayer = PlayerProcessor.getInstance().getPlayer(joiner.id);
                            if(joinedPlayer !== null)
                                joinedPlayer.state = PLAYER_STATE.PLAY;
                        }
                    });
                    this.NotifyUpdatedGame(UPDATE_STATE.UPDATE, room);
                    this.StartSyncGame(room);
                }
            });
        });
    }

    NotifyUpdatedGame = (updateState, room) => {
        this.broadCast('UpdateGame', {status: updateState, game: room});
    }

    StartSyncGame = (room) => {
        let players = [room.owner.id];
        for(let index = 0; index < room.joiners.length; index++) {
            if(room.joiners[index] !== null)
                players.push(room.joiners[index].id);
        }

        const server_socket = SocketManager.getInstance().getServerSocket();
        if(server_socket !== null)
            server_socket.broadCast('StartSync', {players: players, roomId: room.id});
    }
}