const { PLAYER_STATE, GAME_PLAYER_STATE } = require("../../common/constant");

module.exports = class GamePlayer {
    id = null;
    name = null;
    wallet = null;
    state = null;

    constructor(id, name, wallet, state) {
        this.id = id;
        this.name = name;
        this.wallet = wallet;
        this.state = state;
    }
}