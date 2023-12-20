const routerx = require('express-promise-router');
const userRouter = require('./userRouter');

const Router = routerx();

Router.use('/api/auth', userRouter);

module.exports = Router;