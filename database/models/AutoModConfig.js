const mongoose = require('mongoose');

const AutoModConfigSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true,
        unique: true
    },
    antiLinks: {
        type: Boolean,
        default: false
    },
    antiSpam: {
        type: Boolean,
        default: false
    },
    antiBadWords: {
        type: Boolean,
        default: false
    },
    badWordsList: {
        type: [String],
        default: []
    }
});

module.exports = mongoose.model('AutoModConfig', AutoModConfigSchema);
