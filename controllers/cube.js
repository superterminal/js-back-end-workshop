const models = require('../models');

function index(req, res, next) {
    const { from, to, search } = req.query;
    const user = req.user;
    
    let query = {};

    if (search) {
        query = { ...query, name: { $regex: search } };
    }

    if (to) {
        query = { ...query, difficultyLevel: { $lte: +to }};
    }

    if (from) {
        query = { ...query, difficultyLevel: { ...query.difficultyLevel, $gte: +from}};
    }

    models.cubeModel.find(query).then(cubes => {
        res.render('../views/index.hbs', { 
            cubes, 
            search, 
            from, 
            to,
            user
        });
    }).catch(next);
}

function details(req, res, next) {
    const id = req.params.id;
    let  user = req.user;
    models.cubeModel.findById(id).populate('accessories')
        .then(cube => {
            if (!cube) { res.redirect('/not-found'); return; }
            // toString() for creatorId to work, otherwise its an object
            if (cube.creatorId.toString() !== user._id.toString()) {
                user = false;
            }
            console.log('user', user);
            res.render('../views/details.hbs', { cube, user });
    }).catch(next);
}

function notFound(req, res) {
    res.render('404.hbs');
}

function about(req, res) {
    res.render('about.hbs');
}

function postCreate(req, res, next) {
    const { name = null, description = null, imageUrl = null, difficultyLevel = null } = req.body;
    const { user } = req;

    models.cubeModel.create({ name, description, imageUrl, difficultyLevel, creatorId: user._id }).then((cube) => {
        res.redirect('/');
    }).catch(err => {
        if (err.name === 'ValidationError') {
            res.render('create.hbs', {
                errors: err.errors
            });
            return;
        }
        next();
    });
}

function getCreate(req, res) {
    res.render('create.hbs', {user: req.user});
}

function postEdit(req, res, next) {
    const id = req.params.id;
    const { name = null, description = null, imageUrl = null, difficultyLevel = null } = req.body;
    const { user } = req;
    
    models.cubeModel.updateOne({_id: id}, { name, description, imageUrl, difficultyLevel, creatorId: user._id }, {runValidators: true}).then((cube) => {
        res.redirect('/');
    }).catch(err => {
        if (err.name === 'ValidationError') {
            res.render('editCube.hbs', {
                errors: err.errors
            });
            return;
        }
        next(err);
    });
}

function getEdit(req, res, next) {
    const id = req.params.id;
    const user = req.user;
    models.cubeModel.findOne({ _id: id, creatorId: user._id }).then(cube => {
        const options = [
            { title: '1 - Very Easy', selected: 1 === cube.difficultyLevel },
            { title: '2 - Easy', selected: 2 === cube.difficultyLevel } ,
            { title: '3 - Medium (Standard 3x3)', selected: 3 === cube.difficultyLevel },
            { title: '4 - Intermediate', selected: 4 === cube.difficultyLevel },
            { title: '5 - Expert', selected: 5 === cube.difficultyLevel },
            { title: '6 - Hardcore', selected: 6 === cube.difficultyLevel }
        ];
        res.render('editCube.hbs', { cube, user, options });
    }).catch(next);
}

function getDelete(req, res, next) {
    const id = req.params.id;
    const { user } = req;
    models.cubeModel.findOne({ _id: id, creatorId: user._id }).then(cube => {
        const options = [
            { title: '1 - Very Easy', selected: 1 === cube.difficultyLevel },
            { title: '2 - Easy', selected: 2 === cube.difficultyLevel } ,
            { title: '3 - Medium (Standard 3x3)', selected: 3 === cube.difficultyLevel },
            { title: '4 - Intermediate', selected: 4 === cube.difficultyLevel },
            { title: '5 - Expert', selected: 5 === cube.difficultyLevel },
            { title: '6 - Hardcore', selected: 6 === cube.difficultyLevel }
        ];
        res.render('deleteCube.hbs', { cube, options });
    }).catch(next);
}

function postDelete (req, res, next) {
   const id = req.params.id;
   const { user } = req;
   models.cubeModel.findByIdAndDelete({ _id: id, creatorId: user._id }).then(() => {
    res.redirect('/');
   }).catch(next);
}

module.exports = {
    index,
    details,
    notFound,
    about,
    postCreate,
    getCreate,
    getEdit,
    postEdit,
    getDelete,
    postDelete
};