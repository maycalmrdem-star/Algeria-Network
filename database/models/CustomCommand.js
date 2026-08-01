const mongoose = require('mongoose');

const CustomCommandSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true
    },
    commandName: {
        type: String,
        required: true
    },
    response: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Ensure a server can't have duplicate custom commands with the same name
CustomCommandSchema.index({ serverId: 1, commandName: 1 }, { unique: true });

const CustomCommand = mongoose.model('CustomCommand', CustomCommandSchema);

module.exports = CustomCommand;
