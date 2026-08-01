const mongoose = require('mongoose');

const WelcomeConfigSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true,
        unique: true
    },
    enabled: {
        type: Boolean,
        default: false
    },
    channelId: {
        type: String,
        default: ''
    },
    messageText: {
        type: String,
        default: 'Welcome [user] to **[server]**! You are our [memberCount]th member.'
    },
    imageUrl: {
        type: String,
        default: 'https://i.imgur.com/x0R9r2P.jpeg'
    }
});

module.exports = mongoose.model('WelcomeConfig', WelcomeConfigSchema);
