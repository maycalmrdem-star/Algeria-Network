const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Unlocks the current channel (فتح الروم)'),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية إدارة الرومات.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: interaction.channel.id,
                targetName: interaction.channel.name,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'unlock',
                reason: 'Channel Unlocked'
            });

            await interaction.editReply(`🔓 تم فتح الروم بنجاح.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء فتح الروم: ${error.message}`);
        }
    }
};
