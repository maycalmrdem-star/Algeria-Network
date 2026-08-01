"use strict";
/**
 * @param { import('discord.js').Client } Client
 * @param { import('discord.js').Message } Message
 */
const { Collection } = require('discord.js');
const Timeout = new Collection();
const ms = require('ms');
const User = require('../../database/models/User');
const Command = require('../../database/models/Command');
const Shortcut = require('../../database/models/Shortcut');
const { getLevel, getXpForNextLevel } = require('../../utils/levelSystem');

module.exports = async (Client, Message) => {
    if (Message.author.bot) return;
    const userData = await User.findOne({ userId: Message.author.id });
    if (userData) {
        userData.xp += Math.floor(Math.random() * 10) + 15;
        const currentLevel = getLevel(userData.xp);
        const newLevel = getLevel(userData.xp);
        
        if (newLevel > currentLevel) {
            Message.channel.send(`Congratulations ${Message.author}! You've reached level ${newLevel}!`);
        }
        
        await userData.save();
    } else {
        await User.create({
            userId: Message.author.id,
            username: Message.author.username,
            xp: Math.floor(Math.random() * 10) + 15
        });
    }

    // --- AUTO-MODERATION SYSTEM ---
    if (Message.guild) {
        const AutoModConfig = require('../../database/models/AutoModConfig');
        const automod = await AutoModConfig.findOne({ serverId: Message.guild.id });
        
        if (automod) {
            // Check Anti-Links
            if (automod.antiLinks) {
                const linkRegex = /(https?:\/\/[^\s]+)/g;
                if (linkRegex.test(Message.content)) {
                    await Message.delete().catch(() => {});
                    return Message.channel.send(`<@${Message.author.id}>، يُمنع إرسال الروابط في هذا السيرفر!`).then(m => {
                        setTimeout(() => m.delete().catch(()=> {}), 5000);
                    });
                }
            }

            // Check Anti-Bad Words
            if (automod.antiBadWords && automod.badWordsList && automod.badWordsList.length > 0) {
                const containsBadWord = automod.badWordsList.some(word => Message.content.toLowerCase().includes(word.toLowerCase()));
                if (containsBadWord) {
                    await Message.delete().catch(() => {});
                    return Message.channel.send(`<@${Message.author.id}>، يُرجى احترام القوانين وعدم استخدام كلمات مسيئة!`).then(m => {
                        setTimeout(() => m.delete().catch(()=> {}), 5000);
                    });
                }
            }

            // Check Anti-Spam
            if (automod.antiSpam) {
                if (!Client.spamCache) Client.spamCache = new Map();
                const cacheKey = `${Message.guild.id}-${Message.author.id}`;
                
                let userData = Client.spamCache.get(cacheKey);
                if (!userData) {
                    userData = { count: 1, lastMessageTime: Date.now() };
                    Client.spamCache.set(cacheKey, userData);
                } else {
                    const timeDifference = Date.now() - userData.lastMessageTime;
                    
                    if (timeDifference < 5000) { // 5 seconds window
                        userData.count += 1;
                        if (userData.count >= 5) { // 5 messages in 5 seconds = spam
                            await Message.delete().catch(() => {});
                            Client.spamCache.delete(cacheKey); // Reset after action
                            return Message.channel.send(`<@${Message.author.id}>، يُرجى التوقف عن السبام (تكرار الرسائل)!`).then(m => {
                                setTimeout(() => m.delete().catch(()=> {}), 5000);
                            });
                        }
                    } else {
                        userData.count = 1; // Reset if outside window
                    }
                    
                    userData.lastMessageTime = Date.now();
                    Client.spamCache.set(cacheKey, userData);
                }
            }
        }
    }
    // --- END AUTO-MODERATION ---

    const Prefix = Client.Prefix;
    let Args, CommandName;

    if (Message.content.startsWith(Prefix)) {
        Args = Message.content.slice(Prefix.length).trim().split(/ +/);
        CommandName = Args.shift().toLowerCase();
    } else {
        Args = Message.content.trim().split(/ +/);
        CommandName = Args.shift().toLowerCase();
    }
    
    const shortcut = await Shortcut.findOne({
        serverId: Message.guild.id,
        shortcut: CommandName
    });
    console.log(shortcut);
    let Cmds;
    if (shortcut) {
        Args.unshift(shortcut.command);
        Cmds = Client.Çɱɗ.get(shortcut.command) || Client.Çɱɗ.find(cmd => cmd.aliases && cmd.aliases.includes(shortcut.command));
    } else {
        Cmds = Client.Çɱɗ.get(CommandName) || Client.Çɱɗ.find(cmd => cmd.aliases && cmd.aliases.includes(CommandName));
    }

    if (!Cmds) {
        // Check for Custom Commands
        const CustomCommand = require('../../database/models/CustomCommand');
        const customCmd = await CustomCommand.findOne({
            serverId: Message.guild.id,
            commandName: CommandName
        });

        if (customCmd) {
            return Message.channel.send(customCmd.response);
        }
        
        return;
    }

    // Check if the command is enabled for this server
    const commandStatus = await Command.findOne({ 
        userId: Message.author.id, 
        serverId: Message.guild.id, 
        command: Cmds.name 
    });

    if (commandStatus && !commandStatus.enabled) {
        return Message.reply('This command is currently disabled for you in this server.');
    }

    if (Cmds.permissions && !Message.member.permissions.has(Cmds.permissions)) {
        return Message.reply('You do not have the required permissions to use this command.');
    }

    if (Cmds.cooldown) {
        const cooldownKey = `${Cmds.name}-${Message.author.id}`;
        if (Timeout.has(cooldownKey)) {
            const remainingTime = Timeout.get(cooldownKey) - Date.now();
            const timeString = ms(remainingTime, { long: true });
            const response = await Message.reply({ 
                content: `**${Message.author.username}**, Cool down (**${timeString.includes('ms') ? '0 seconds' : timeString}** left)`,
                allowedMentions: { repliedUser: false }
            });
            setTimeout(() => {
                response.delete().catch(() => {});
                Message.delete().catch(() => {});
            }, 5000);
            return;
        }

        Timeout.set(cooldownKey, Date.now() + Cmds.cooldown * 1000);
        setTimeout(() => Timeout.delete(cooldownKey), Cmds.cooldown * 1000);
    }

    try {
        await Cmds.run(Client, Message, Args);
    } catch (error) {
        console.error('Error executing command:', error);
        await Message.reply('An error occurred while executing the command. Please try again later.').catch(() => {});
    }
};
