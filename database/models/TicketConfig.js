const mongoose = require('mongoose');

const TicketConfigSchema = new mongoose.Schema({
    serverId: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        default: ''
    },
    adminRoleId: {
        type: String,
        default: ''
    },
    ticketCount: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('TicketConfig', TicketConfigSchema);
