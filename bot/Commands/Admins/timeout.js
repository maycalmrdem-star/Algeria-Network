const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Times out a user in the server (إسكات عضو)')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user to timeout (العضو المراد إسكاته)')
                .setRequired(true))
        .addIntegerOption(option => 
            option.setName('duration')
                .setDescription('Duration in minutes (المدة بالدقائق)')
                .setRequired(true))
        .addStringOption(option => 
            option.setName('reason')
                .setDescription('Reason for the timeout (سبب الإسكات)')
                .setRequired(false)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية إدارة الأعضاء لإعطاء تايم أوت.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const durationMinutes = interaction.options.getInteger('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';
        const member = await interaction.guild.members.fetch(targetUser.id).catch(() => null);

        if (!member) {
            return interaction.reply({ content: "❌ لم أتمكن من العثور على هذا العضو في السيرفر.", ephemeral: true });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({ content: "❌ لا يمكنك إعطاء تايم أوت لنفسك!", ephemeral: true });
        }

        if (!member.moderatable) {
            return interaction.reply({ content: "❌ لا أستطيع إعطاء تايم أوت لهذا العضو. قد تكون رتبته أعلى من رتبتي.", ephemeral: true });
        }

        await interaction.deferReply();

        try {
            const durationMs = durationMinutes * 60 * 1000;
            await member.timeout(durationMs, reason);
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: member.id,
                targetName: targetUser.tag,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'timeout',
                reason: `Duration: ${durationMinutes}m | ${reason}`
            });

            await interaction.editReply(`✅ تم إعطاء **${targetUser.tag}** تايم أوت لمدة ${durationMinutes} دقيقة. السبب: ${reason}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء محاولة إعطاء التايم أوت: ${error.message}`);
        }
    }
};
