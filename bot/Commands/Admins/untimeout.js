const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('untimeout')
        .setDescription('Removes timeout from a user (إزالة التايم أوت)')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to untimeout (العضو)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for removing timeout (السبب)')
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية إدارة الأعضاء.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ لم أتمكن من العثور على هذا العضو في السيرفر.", ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: "❌ لا أستطيع إزالة التايم أوت عن هذا العضو.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await member.timeout(null, reason);
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: member.id,
                targetName: targetUser.tag,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'untimeout',
                reason: reason
            });

            await interaction.editReply(`✅ تم إزالة التايم أوت عن **${targetUser.tag}** بنجاح.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ: ${error.message}`);
        }
    }
};
