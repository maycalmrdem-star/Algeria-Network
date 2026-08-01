const mongoose = require('mongoose');

const ModerationLogSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true
    },
    targetId: {
        type: String,
        required: true
    },
    targetName: {
        type: String,
        required: true
    },
    moderatorId: {
        type: String,
        required: true
    },
    moderatorName: {
        type: String,
        required: true
    },
    action: {
        type: String,
        enum: ['ban', 'kick', 'timeout', 'warn', 'unban'],
        required: true
    },
    reason: {
        type: String,
        default: 'No reason provided'
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ModerationLog', ModerationLogSchema);
