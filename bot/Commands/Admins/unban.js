const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a user from the server (إلغاء حظر عضو)')
        .addStringOption(option => 
            option.setName('userid')
                .setDescription('The ID of the user to unban (أيدي العضو)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the unban (السبب)')
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية حظر الأعضاء.", ephemeral: true });
        }

        const userId = interaction.options.getString('userid');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        await interaction.deferReply();

        try {
            await interaction.guild.members.unban(userId, reason);
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: userId,
                targetName: userId,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'unban',
                reason: reason
            });

            await interaction.editReply(`✅ تم إلغاء حظر العضو صاحب الأيدي **${userId}** بنجاح.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ، تأكد من صحة الأيدي وأن العضو محظور فعلاً: ${error.message}`);
        }
    }
};
