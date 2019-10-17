const mongoose = require('mongoose');

const cubeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        validate: [
            {
                validator: v => {
                    return v.length > 2;
                },
                message: props => `${props.value} length should be larger than 2!`
            },
            {
                validator: v => {
                    return v.length < 10;
                },
                message: props => `${props.value} length should be less than 10!`
            }
        ]
    },
    description: String,
    imageUrl: String,
    difficultyLevel: Number,
    accessories: [{ type: mongoose.Types.ObjectId, ref:'Accessories' }],
    creatorId: { type: mongoose.Types.ObjectId, ref:'User' }
});

module.exports = mongoose.model('Cube', cubeSchema);