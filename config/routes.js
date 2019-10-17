// TODO: Require Controllers...

const cubeController = require('../controllers/cube');
const accessoryController = require('../controllers/accessory');
const authController = require('../controllers/auth');
const { auth } = require('../utils');

const { body } = require('express-validator');

module.exports = (app) => {
    app.get('/create/accessory', accessoryController.createGet);
    app.post('/create/accessory', accessoryController.createPost);
    app.get('/attach/accessory/:id', accessoryController.attachGet);
    app.post('/attach/accessory/:id', accessoryController.attachPost);
    app.get('/details/:id', auth(false), cubeController.details);
    
    app.get('/about', cubeController.about);
    app.get('/login', authController.login);
    app.get('/register', authController.register);
    app.post('/login', authController.loginPost);
    app.post('/register', body('repeatPassword').custom((value, { req }) => {
        if (value !== req.body.password) {
            //throw new Error('Passwords don\'t match!');
            return false;
        }
        return true;
    }), authController.registerPost);

    app.get('/logout', authController.logout);
    app.get('/not-found', cubeController.notFound);

    app.get('/create', auth(), cubeController.getCreate);
    app.post('/create', auth(), cubeController.postCreate);
    app.get('/edit/:id', auth(), cubeController.getEdit);
    app.post('/edit/:id', auth(), cubeController.postEdit);
    app.get('/delete/:id', auth(), cubeController.getDelete);
    app.post('/delete/:id', auth(), cubeController.postDelete);

    app.get('/', auth(false), cubeController.index);
    app.get('*', (req, res) => { res.render('404.hbs') })
};