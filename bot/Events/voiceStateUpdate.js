const { Events, ChannelType, PermissionsBitField } = require('discord.js');
const TempChannelConfig = require('../../database/models/TempChannelConfig');

// Store active temp channels to clean them up when empty
const activeTempChannels = new Set();

module.exports = async (Client, oldState, newState) => {
    // Only run if the user joined a channel or moved between channels
    if (newState.channelId && newState.channelId !== oldState.channelId) {
        
        const config = await TempChannelConfig.findOne({ serverId: newState.guild.id });
        if (config && config.joinChannelId && config.categoryId) {
            
            // Did they join the designated "Join to Create" channel?
            if (newState.channelId === config.joinChannelId) {
                try {
                    const newChannel = await newState.guild.channels.create({
                        name: `غرفة ${newState.member.user.username}`,
                        type: ChannelType.GuildVoice,
                        parent: config.categoryId,
                        permissionOverwrites: [
                            {
                                id: newState.guild.id,
                                allow: [PermissionsBitField.Flags.ViewChannel],
                            },
                            {
                                id: newState.member.id,
                                allow: [
                                    PermissionsBitField.Flags.ViewChannel,
                                    PermissionsBitField.Flags.ManageChannels,
                                    PermissionsBitField.Flags.ManageRoles, // To let them manage permissions for their VC
                                    PermissionsBitField.Flags.MuteMembers,
                                    PermissionsBitField.Flags.DeafenMembers,
                                    PermissionsBitField.Flags.MoveMembers
                                ],
                            }
                        ]
                    });

                    activeTempChannels.add(newChannel.id);
                    
                    // Move the user to the newly created channel
                    await newState.setChannel(newChannel);

                } catch (err) {
                    console.error("Error creating temp voice channel:", err);
                }
            }
        }
    }

    // Cleanup: Check if old channel is empty and is a temp channel
    if (oldState.channelId && oldState.channelId !== newState.channelId) {
        if (activeTempChannels.has(oldState.channelId)) {
            const oldChannel = oldState.guild.channels.cache.get(oldState.channelId);
            
            if (oldChannel && oldChannel.members.size === 0) {
                oldChannel.delete().catch(() => {});
                activeTempChannels.delete(oldState.channelId);
            }
        }
    }
};
