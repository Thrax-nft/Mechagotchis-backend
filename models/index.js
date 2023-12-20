const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.set('strictQuery', true);

const models = {};
models.mongoose = mongoose;
models.UserModel = require('./UserModel');

module.exports = models;