const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Locks the current channel (إغلاق الروم)'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية إدارة الرومات.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: interaction.channel.id,
                targetName: interaction.channel.name,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'lock',
                reason: 'Channel Locked'
            });

            await interaction.editReply(`🔒 تم إغلاق الروم بنجاح.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء إغلاق الروم: ${error.message}`);
        }
    }
};
