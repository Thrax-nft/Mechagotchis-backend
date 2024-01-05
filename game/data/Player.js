const { PLAYER_STATE } = require("../../common/constant");

module.exports = class Player {
    id = null;
    socket = null;
    name = null;
    wallet = null;
    level = null;
    character = null;
    weapons = null;
    state = null;
    room = null;

    constructor(id, socket, name, wallet, level, character, weapons) {
        this.id = id;
        this.socket = socket;
        this.name = name;
        this.wallet = wallet;
        this.level = level;
        this.character = character;
        this.weapons = weapons;
        this.state = PLAYER_STATE.EQUIP;
    }

    updateCharacter = (data) => {
        this.character = data.character;
    }

    updateWeapons = (data) => {
        this.weapons.leftArm = data.leftArm;
        this.weapons.rightArm = data.rightArm;
        this.weapons.leftShoulder = data.leftShoulder;
        this.weapons.rightShoulder = data.rightShoulder;
    }

    updateState = (state) => {
        this.state = state;
    }

    hasGameRoom = () => {
        return this.room !== null;
    }
}