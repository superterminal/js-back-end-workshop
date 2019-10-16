const models = require('../models');
const utils = require('../utils');
const appConfig = require('../app-config');

function login(req, res) {
    res.render('login.hbs');
}

function register(req, res, next) {
    res.render('register.hbs');
}

function loginPost(req, res, next) {
    const { username, password } = req.body;
    models.userModel.findOne({ username })
        .then(user => Promise.all([user, user ? user.matchPassword(password) : false]))
        .then(([user, match]) => {
            if (!match) {
                res.render('login.hbs', { message: 'Wrong password or username'});
                return;
            }
            const token = utils.jwt.createToken({id: user._id});
            res.cookie(appConfig.authCookieName, token).redirect('/');
        })
}

function registerPost(req, res, next) {
    const { username, password, repeatPassword } = req.body;

    if (password !== repeatPassword) { 
        res.render('register.hbs', { 
            errors: { 
                repeatPassword: 'Password and repeat password don\'t match' 
            } 
        })
        return;
    }

    return models.userModel.create({ username, password }).then(() => {
        res.redirect('/login');
    }).catch(err => {
        if (err.name === 'MongoError' && err.code === 11000) {
            res.render('register.hbs', { 
                errors: { 
                    username: 'User already registered' 
                } 
            });
            return;
        }
        next(err);
    });
}

function logout(req, res) {
    const token = req.cookies[appConfig.authCookieName];
    models.tokenBlacklistModel.create({ token }).then(() => {
        res.clearCookie(appConfig.authCookieName).redirect('/');
    });
}

module.exports = {
    login, 
    loginPost,
    register,
    registerPost,
    logout
}