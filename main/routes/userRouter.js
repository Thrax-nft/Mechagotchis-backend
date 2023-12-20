const routerx = require('express-promise-router');
const userController = require('../controllers/userController');

const Router = routerx();

Router.post('/userLogin', userController.userLogin);
Router.post('/userRegister', userController.userRegister);

module.exports = Router;