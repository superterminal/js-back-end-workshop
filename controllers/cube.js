const { cubeModel } = require('../models');

function index(req, res, next) {
    const { from, to, search } = req.query;
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

    cubeModel.find(query).then(cubes => {
        res.render('../views/index.hbs', { 
            cubes, 
            search, 
            from, 
            to
        });
    }).catch(next);
}

function details(req, res, next) {
    const id = req.params.id;
    cubeModel.findById(id).populate('accessories')
        .then(cube => {
            if (!cube) { res.redirect('/not-found'); return; }
            res.render('../views/details.hbs', { cube });
    }).catch(next);
}

function notFound(req, res) {
    res.render('404.hbs');
}

function about(req, res) {
    res.render('about.hbs');
}

function postCreate(req, res) {
    const { name = null, description = null, imageUrl = null, difficultyLevel = null } = req.body;
    // const newCube = cubeModel.create(name, description, imageUrl, difficultyLevel);
    cubeModel.create({ name, description, imageUrl, difficultyLevel }).then((cube) => {
        console.log(cube);
        res.redirect('/');
    });
}

function getCreate(req, res) {
    res.render('create.hbs');
}

module.exports = {
    index,
    details,
    notFound,
    about,
    postCreate,
    getCreate
};