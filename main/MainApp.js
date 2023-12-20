exports.createApp = (port, db) => {
    const express = require('express');
    const path = require('path');
    const models = require('../models/index');

    const app = require('../common/app').createApp(port);

    app.use(express.static('client'));
    app.use('/', require('./middleware/index'), require('./routes/index'));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
    });

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