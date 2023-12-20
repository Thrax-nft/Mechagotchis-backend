exports.createApp = (port, db) => {
    const models = require('../models/index');

    const app = require('../common/app').createApp(port);

    models.mongoose.connect(db)
        .then(() => {
            console.log('service was connected to database.');
        })
        .catch((err) => {
            console.error({title: 'database connection error', message: err.message});
            process.exit();
        });
    
    return app;
}