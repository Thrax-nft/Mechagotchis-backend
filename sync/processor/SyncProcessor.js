const Room = require("../data/Room");

module.exports = class SyncProcessor {
    static _instance = null;

    rooms = [];

    static getInstance = () => {
        if(SyncProcessor._instance === null)
            SyncProcessor._instance = new SyncProcessor();

        return SyncProcessor._instance;
    }

    constructor() {

    }

    addRoom = (id) => {
        const index = this.rooms.findIndex(room => room.id === id);
        if(index >= 0) {
            return null;
        }
        else {
            let room = new Room(id);
            this.rooms.push(room);
            return room;
        }
    }

    // addPlayer = async (id, socket) => {

    //     if(!id)
    //         return {status: false, message: 'Invalid Player'};

    //     let player = this.getPlayer(id);
    //     if(player !== null)
    //         return {status: false, message: 'Player added already'};

    //     player = await models.UserModel.findOne({_id: id});
    //     if(!player)
    //         return {status: false, message: 'Unauthorized Player'};

    //     this.players.push(new Player(player._id.toString(), socket, player.name, player.wallet, player.level, player.character, player.weapons));
        
    //     return {status: true};
    // }

    // removePlayer = (id) => {
    //     const index = this.players.findIndex(player => player.id === id);
    //     if(index >= 0)
    //         this.players.splice(index, 1);
    // } 

    // getPlayer = (id) => {
    //     const index = this.players.findIndex(player => player.id === id);
    //     return (index >= 0) ? this.players[index] : null;
    // }

    // updatePlayerWeapons = async (data) => {
    //     if(!data.userId)
    //         return {status: false, message: 'Invalid Player'};

    //     let player = this.getPlayer(data.userId);
    //     if(player === null)
    //         return {status: false, message: 'Player was not logined'};

    //     let user = await models.UserModel.findOne({_id: data.userId});
    //     if(!user)
    //         return {status: false, message: 'Unauthorized Player'};

    //     player.updateWeapons(data);
    //     user.weapons = player.weapons;
    //     await user.save();

    //     return {status: true};
    // }

    // updatePlayerState = (playerId, state) => {
    //     if(!playerId)
    //         return false;

    //     let player = this.getPlayer(playerId);
    //     if(player === null)
    //         return false;

    //     player.updateState(state);
    //     return true;
    // }
}