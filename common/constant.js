module.exports = {
    CHARACTER_TYPE: {
        ROBOT: 0,
        SCOUT: 1
    },

    WEAPON_TYPE: {
        FUD_BLASTER: 0,
        ALPHA_BEAM: 1,
        GATLING_CANNON: 2,
        FOMO_THROWER: 3,
        SWARM_MISSLE: 4,
    },

    PLAYER_STATE: {
        NONE: 0,
        EQUIP: 1,
        LOBBY: 2,
        SLOT: 3,
        PLAY: 4
    },

    GAME_MODE: {
        SOLO_BR: 'SOLO BR'
    },

    GAME_STATE: {
        NONE: 0,
        PREPARE: 1,
        STARTED: 2,
        PLAY: 3,
        FINISHED: 4
    },

    GAME_PLAYER_STATE: {
        NOT_READY: 0,
        READY: 1
    },

    UPDATE_STATE: {
        CREATE: 0,
        UPDATE: 1,
        DELETE: 2
    },

    MAX_PLAYERS_PER_GAME: 10,
    LOAD_TIME: 10
}