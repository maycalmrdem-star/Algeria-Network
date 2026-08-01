const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../dashboard/config/config.cjs');

async function deployCommands(clientId) {
    const commands = [];
    const commandsPath = path.join(__dirname, 'Commands');
    
    // Read all directories inside Commands
    if (fs.existsSync(commandsPath)) {
        const commandFolders = fs.readdirSync(commandsPath);
        for (const folder of commandFolders) {
            const folderPath = path.join(commandsPath, folder);
            if (fs.statSync(folderPath).isDirectory()) {
                const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));
                for (const file of commandFiles) {
                    const filePath = path.join(folderPath, file);
                    const command = require(filePath);
                    if ('data' in command && 'execute' in command) {
                        commands.push(command.data.toJSON());
                    } else if (command.name) {
                        // Legacy command support logic not pushed here, only push valid slash commands
                    }
                }
            }
        }
    }

    const rest = new REST({ version: '10' }).setToken(config.token);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // The put method is used to fully refresh all commands globally
        const data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error('Error deploying commands:', error);
    }
}

module.exports = deployCommands;
