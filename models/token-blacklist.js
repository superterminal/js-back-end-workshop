const mongoose = require('mongoose');

const tokenBlacklistSchema = new mongoose.Schema({
    token: String
});

module.exports = mongoose.model('TokenBlacklist', tokenBlacklistSchema);