const mongoose = require('mongoose');

const TempChannelConfigSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true,
        unique: true
    },
    joinChannelId: {
        type: String,
        default: ''
    },
    categoryId: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('TempChannelConfig', TempChannelConfigSchema);
