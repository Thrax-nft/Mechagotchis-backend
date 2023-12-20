module.exports = class Player {
    id = null;
    name = null;
    level = null;
    character = null;
    weapons = null;

    constructor(id, name, level, character, weapons) {
        this.id = id;
        this.name = name;
        this.level = level;
        this.character = character;
        this.weapons = weapons;
    }

    updateWeapons = (data) => {
        this.weapons.leftArm = data.leftArm;
        this.weapons.rightArm = data.rightArm;
        this.weapons.leftShoulder = data.leftShoulder;
        this.weapons.rightShoulder = data.rightShoulder;
    }
}