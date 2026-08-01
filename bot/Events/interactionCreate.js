const { Events, ChannelType, PermissionsBitField, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const TicketConfig = require('../../database/models/TicketConfig');

module.exports = {
    name: Events.InteractionCreate,
    async execute(interaction) {
        if (!interaction.isButton()) return;

        if (interaction.customId === 'create_ticket') {
            const config = await TicketConfig.findOne({ serverId: interaction.guild.id });
            
            if (!config || !config.categoryId || !config.adminRoleId) {
                return interaction.reply({ content: '❌ نظام التذاكر غير مُعد بشكل صحيح. يرجى مراجعة لوحة التحكم.', ephemeral: true });
            }

            // Increment ticket count
            config.ticketCount += 1;
            await config.save();

            const ticketName = `ticket-${config.ticketCount}`;
            
            try {
                // Create the channel
                const channel = await interaction.guild.channels.create({
                    name: ticketName,
                    type: ChannelType.GuildText,
                    parent: config.categoryId,
                    permissionOverwrites: [
                        {
                            id: interaction.guild.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },
                        {
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        },
                        {
                            id: config.adminRoleId,
                            allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages, PermissionsBitField.Flags.ReadMessageHistory],
                        }
                    ],
                });

                // Send welcome message in ticket
                const embed = new EmbedBuilder()
                    .setColor('#7289da')
                    .setTitle(`تذكرة دعم - ${interaction.user.username}`)
                    .setDescription(`مرحباً بك <@${interaction.user.id}>!\nالرجاء طرح مشكلتك أو استفسارك هنا، وسيقوم أحد أفراد فريق الدعم بالرد عليك قريباً.\n\nلإغلاق التذكرة اضغط على الزر بالأسفل.`);

                const row = new ActionRowBuilder().addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('إغلاق التذكرة')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒')
                );

                await channel.send({ content: `<@${interaction.user.id}> | <@&${config.adminRoleId}>`, embeds: [embed], components: [row] });
                
                await interaction.reply({ content: `✅ تم إنشاء تذكرتك بنجاح: <#${channel.id}>`, ephemeral: true });

            } catch (err) {
                console.error("Error creating ticket:", err);
                interaction.reply({ content: '❌ حدث خطأ أثناء إنشاء التذكرة. يرجى التأكد من صلاحيات البوت.', ephemeral: true });
            }
        } else if (interaction.customId === 'close_ticket') {
            if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageChannels)) {
                return interaction.reply({ content: '❌ لا تملك الصلاحية لإغلاق التذكرة.', ephemeral: true });
            }

            await interaction.reply('سيتم إغلاق التذكرة خلال 5 ثوانٍ...');
            
            setTimeout(() => {
                interaction.channel.delete().catch(() => {});
            }, 5000);
        }
    }
};
