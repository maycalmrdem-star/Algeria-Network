"use strict";

const { EmbedBuilder, AttachmentBuilder } = require('discord.js');
const WelcomeConfig = require('../../database/models/WelcomeConfig');

module.exports = async (Client, member) => {
    try {
        // --- ANTI-RAID SYSTEM ---
        const AntiRaidConfig = require('../../database/models/AntiRaidConfig');
        const antiRaid = await AntiRaidConfig.findOne({ serverId: member.guild.id });
        
        if (antiRaid && antiRaid.enabled) {
            if (!Client.joinCache) Client.joinCache = new Map();
            const cacheKey = member.guild.id;
            let joinData = Client.joinCache.get(cacheKey);
            
            if (!joinData) {
                joinData = { count: 1, firstJoinTime: Date.now() };
                Client.joinCache.set(cacheKey, joinData);
            } else {
                const timeDiff = Date.now() - joinData.firstJoinTime;
                // antiRaid.timeWindow is in seconds
                if (timeDiff < (antiRaid.timeWindow * 1000)) {
                    joinData.count += 1;
                    if (joinData.count >= antiRaid.threshold) {
                        // Raid detected
                        if (antiRaid.action === 'kick') {
                            await member.kick('Anti-Raid system triggered').catch(()=>{});
                        } else if (antiRaid.action === 'ban') {
                            await member.ban({ reason: 'Anti-Raid system triggered' }).catch(()=>{});
                        }
                        // Don't continue welcoming them if they are raided
                        return;
                    }
                } else {
                    // Reset window
                    joinData = { count: 1, firstJoinTime: Date.now() };
                }
                Client.joinCache.set(cacheKey, joinData);
            }
        }
        // --- END ANTI-RAID ---

        // --- AUTO ROLES ---
        const AutoRoleConfig = require('../../database/models/AutoRoleConfig');
        const autoRole = await AutoRoleConfig.findOne({ serverId: member.guild.id });
        if (autoRole && autoRole.enabled && autoRole.roleIds && autoRole.roleIds.length > 0) {
            // Assign roles
            for (const roleId of autoRole.roleIds) {
                const role = member.guild.roles.cache.get(roleId);
                if (role) {
                    await member.roles.add(role).catch(err => console.error('Failed to assign auto-role:', err));
                }
            }
        }
        // --- END AUTO ROLES ---

        // --- WELCOME MODULE ---
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
        // --- END WELCOME ---
        
    } catch (error) {
        console.error('Error in guildMemberAdd event:', error);
    }
};
