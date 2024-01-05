const { GAME_STATE } = require('../../common/constant');
const Room = require('../data/Room');

module.exports = class RoomProcessor {
    static _instance = null;

    rooms = [];

    roomIndex = 1;

    static getInstance = () => {
        if(RoomProcessor._instance === null)
            RoomProcessor._instance = new RoomProcessor();

        return RoomProcessor._instance;
    }

    constructor() {
        this.roomIndex = 1;
    }

    addRoom = (owner) => {
        if(!owner)
            return null;

        let room = new Room(this.roomIndex, owner);
        this.rooms.push(room);
        this.roomIndex++;
        return room;
    }

    getRoom = (id) => {
        const index = this.rooms.findIndex(room => room.id === id);
        return (index >= 0) ? this.rooms[index] : null;
    }

    removeRoom = (id) => { 
        const index = this.rooms.findIndex(room => room.id === id);
        if(index >= 0)
            this.rooms.splice(index, 1);
    }

    getPrepareRooms = () => {
        let prepareRooms = [];
        for(let index = 0; index < this.rooms.length; index++) {
            if(this.rooms[index].state === GAME_STATE.PREPARE)
                prepareRooms.push(this.rooms[index]);
        }

        return prepareRooms;
    }
}