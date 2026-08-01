const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');
const ModerationLog = require('../../../database/models/ModerationLog');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear')
        .setDescription('Clears a specific amount of messages in the channel (مسح الرسائل)')
        .addIntegerOption(option => 
            option.setName('amount')
                .setDescription('Number of messages to clear (between 1 and 100)')
                .setRequired(true)
                .setMinValue(1)
                .setMaxValue(100)),
    
    async execute(interaction) {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
            return interaction.reply({ content: "❌ عذراً، لا تمتلك صلاحية إدارة الرسائل.", ephemeral: true });
        }

        const amount = interaction.options.getInteger('amount');

        await interaction.deferReply({ ephemeral: true });

        try {
            const deleted = await interaction.channel.bulkDelete(amount, true);
            
            await ModerationLog.create({
                serverId: interaction.guild.id,
                targetId: interaction.channel.id,
                targetName: interaction.channel.name,
                moderatorId: interaction.user.id,
                moderatorName: interaction.user.tag,
                action: 'clear',
                reason: `Cleared ${deleted.size} messages`
            });

            await interaction.editReply(`✅ تم مسح **${deleted.size}** رسالة بنجاح.`);
        } catch (error) {
            console.error(error);
            await interaction.editReply(`❌ حدث خطأ أثناء محاولة مسح الرسائل: ${error.message}`);
        }
    }
};
