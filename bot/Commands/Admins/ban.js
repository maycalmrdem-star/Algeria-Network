const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Bans a user from the server (حظر عضو)')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to ban (العضو المراد حظره)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the ban (سبب الحظر)')
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية حظر الأعضاء.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ لم أتمكن من العثور على هذا العضو في السيرفر.", ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "❌ لا يمكنك حظر نفسك!", ephemeral: true });
        }

        if (!member.bannable) {
            return interaction.reply({ content: "❌ لا أستطيع حظر هذا العضو. قد تكون رتبته أعلى من رتبتي.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await member.ban({ reason: reason });
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: member.id,
                targetName: targetUser.tag,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'ban',
                reason: reason
            });

            await interaction.editReply(`✅ تم حظر **${targetUser.tag}** بنجاح. السبب: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء محاولة حظر العضو: ${error.message}`);
        }
    }
};
