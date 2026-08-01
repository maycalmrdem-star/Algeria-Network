"use strict";

const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const WelcomeConfig = require('../../database/models/WelcomeConfig');

module.exports = async (Client, member) => {
    try {
        const config = await WelcomeConfig.findOne({ serverId: member.guild.id });
        
        if (!config || !config.enabled || !config.channelId) return;

        const channel = member.guild.channels.cache.get(config.channelId);
        if (!channel) return;

        // Replace placeholders in text
        let welcomeMsg = config.messageText
            .replace(/\[user\]/gi, `<@${member.id}>`)
            .replace(/\[server\]/gi, member.guild.name)
            .replace(/\[memberCount\]/gi, member.guild.memberCount);

        const embed = new EmbedBuilder()
            .setColor('#7289da')
            .setTitle('👋 عضو جديد!')
            .setDescription(welcomeMsg)
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true, size: 256 }))
            .setFooter({ text: `${member.guild.name} • ${member.user.tag}`, iconURL: member.guild.iconURL({ dynamic: true }) })
            .setTimestamp();

        if (config.imageUrl && config.imageUrl.trim() !== '') {
            embed.setImage(config.imageUrl);
        }

        channel.send({ content: `<@${member.id}>`, embeds: [embed] }).catch(err => console.error("Error sending welcome:", err));
        
    } catch (error) {
        console.error('Error in guildMemberAdd event:', error);
    }
};
