const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: String,
    description: String,
    imageUrl: String,
    difficultyLevel: Number
});

cubeSchema.methods.getDescription = function() {
    return this.description;
};

module.exports = mongoose.model('Cube', cubeSchema);