const mongoose = require('mongoose');
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../common/config');
const { CHARACTER_TYPE, WEAPON_TYPE } = require('../common/constant');

const ModelSchema = mongoose.Schema({
    name : { type: String, default: 'Player' },
    wallet: { type: String, default: '' },
    level: { type: Number, default: 1 },
    character: { type: Number, default: CHARACTER_TYPE.ROBOT },
    weapons: {
        leftArm : { type: Number, default: WEAPON_TYPE.GATLING_CANNON },
        rightArm : { type: Number, default: WEAPON_TYPE.GATLING_CANNON },
        leftShoulder : { type: Number, default: WEAPON_TYPE.SWARM_MISSLE },
        rightShoulder : { type: Number, default: WEAPON_TYPE.SWARM_MISSLE }
    }
}, {autoIndex: true, timestamps: true});

ModelSchema.set('toObject', { virtuals: true });
ModelSchema.set('toJSON', { virtuals : true });

module.exports = mongoose.model('Users', ModelSchema);