const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('Kicks a user from the server (طرد عضو)')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to kick (العضو المراد طرده)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the kick (سبب الطرد)')
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية طرد الأعضاء.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ لم أتمكن من العثور على هذا العضو في السيرفر.", ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "❌ لا يمكنك طرد نفسك!", ephemeral: true });
        }

        if (!member.kickable) {
            return interaction.reply({ content: "❌ لا أستطيع طرد هذا العضو. قد تكون رتبته أعلى من رتبتي.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            await member.kick(reason);
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: member.id,
                targetName: targetUser.tag,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'kick',
                reason: reason
            });

            await interaction.editReply(`✅ تم طرد **${targetUser.tag}** بنجاح. السبب: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء محاولة طرد العضو: ${error.message}`);
        }
    }
};
