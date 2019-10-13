// const dbUrl = 'mongodb://localhost:27017';
// const { MongoClient } = require('mongodb');
// const client = new MongoClient(dbUrl);
// client.connect(function (err, client) {
//     if (err) { console.error(err); return; }
//     const db = client.db('testdb');
//     const users = db.collection('users');
//     users.deleteMany({ name: 'test'}).then(deletedEntity => {
//         console.log(deletedEntity);
//     });
//     // users.insert({ name: 'test'}).then(user => {
//     //     console.log(user);
//     // });
// });

global.__basedir = __dirname;
const dbConnector = require('./config/db');
dbConnector().then(() => {
    const config = require('./config/config');
    const app = require('express')();
    
    require('./config/express')(app);
    require('./config/routes')(app);

    app.use(function(err, req, res, next) {
        console.error(error);
        res.render('500.hbs', { errorMessage: err.message });
    })
    
    app.listen(config.port, console.log(`Listening on port ${config.port}! Now its up to you...`));
}).catch(console.error);
