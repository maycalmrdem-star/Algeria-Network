const { Client, GatewayIntentBits, Collection } = require('discord.js');
const config = require('../dashboard/config/config.cjs');
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.on('ready', async () => {
    require('../dashboard/server.cjs')(client);
    
    // Deploy slash commands
    const deployCommands = require('./deploy-commands');
    await deployCommands(client.user.id);
});

client.commands = new Collection(); // For Slash commands
client.Çɱɗ = new Collection()
client.Çʍɗ = new Collection()
client.Prefix = config.prefix

const fs = require('fs')
fs.readdirSync(`${process.cwd()}/bot/Handler/`).forEach((Handler) => {
    require(`${process.cwd()}/bot/Handler/${Handler}`)(client)
})
client.on('error', error => {
    console.error('The bot encountered an error:', error);
});

process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});

client.login(config.token);

module.exports = client;
