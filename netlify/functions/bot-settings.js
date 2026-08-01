import mongoose from 'mongoose';

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-password, x-admin-pin"
};

// Define Models (if not already cached by mongoose)
const AutoModSchema = new mongoose.Schema({
    serverId: String,
    antiLinks: { type: Boolean, default: false },
    antiSpam: { type: Boolean, default: false },
    antiBadWords: { type: Boolean, default: false },
    badWordsList: { type: [String], default: [] }
});
const AutoModConfig = mongoose.models.AutoModConfig || mongoose.model('AutoModConfig', AutoModSchema);

const WelcomeSchema = new mongoose.Schema({
    serverId: String,
    enabled: { type: Boolean, default: false },
    channelId: { type: String, default: '' },
    messageText: { type: String, default: 'Welcome [user] to **[server]**! You are our [memberCount]th member.' },
    imageUrl: { type: String, default: 'https://i.imgur.com/x0R9r2P.jpeg' }
});
const WelcomeConfig = mongoose.models.WelcomeConfig || mongoose.model('WelcomeConfig', WelcomeSchema);

const TicketSchema = new mongoose.Schema({
    serverId: String,
    categoryId: { type: String, default: '' },
    adminRoleId: { type: String, default: '' }
});
const TicketConfig = mongoose.models.TicketConfig || mongoose.model('TicketConfig', TicketSchema);

const CustomCommandSchema = new mongoose.Schema({
    serverId: String,
    commandName: String,
    response: String,
    createdAt: { type: Date, default: Date.now }
});
// Only index if not already created to prevent strict mode issues on serverless functions.
const CustomCommand = mongoose.models.CustomCommand || mongoose.model('CustomCommand', CustomCommandSchema);

// New Models
const LevelingSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, levelUpMessage: { type: String, default: 'Congratulations [user], you leveled up to level [level]!' }, levelUpChannelId: { type: String, default: '' }, noXpChannels: { type: [String], default: [] }, noXpRoles: { type: [String], default: [] } });
const LevelingConfig = mongoose.models.LevelingConfig || mongoose.model('LevelingConfig', LevelingSchema);

const AutoRoleSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, roleIds: { type: [String], default: [] } });
const AutoRoleConfig = mongoose.models.AutoRoleConfig || mongoose.model('AutoRoleConfig', AutoRoleSchema);

const ColorSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, roles: [{ roleId: String, name: String }] });
const ColorConfig = mongoose.models.ColorConfig || mongoose.model('ColorConfig', ColorSchema);

const SelfRoleSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, channelId: { type: String, default: '' }, messageId: { type: String, default: '' }, roles: [{ emoji: String, roleId: String, description: String }] });
const SelfRoleConfig = mongoose.models.SelfRoleConfig || mongoose.model('SelfRoleConfig', SelfRoleSchema);

const StarboardSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, channelId: { type: String, default: '' }, starCount: { type: Number, default: 3 } });
const StarboardConfig = mongoose.models.StarboardConfig || mongoose.model('StarboardConfig', StarboardSchema);

const TempLinkSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, channelId: { type: String, default: '' }, maxUses: { type: Number, default: 1 }, expiresIn: { type: Number, default: 86400 } });
const TempLinkConfig = mongoose.models.TempLinkConfig || mongoose.model('TempLinkConfig', TempLinkSchema);

const ModLogSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, channelId: { type: String, default: '' }, events: { type: [String], default: [] } });
const ModLogConfig = mongoose.models.ModLogConfig || mongoose.model('ModLogConfig', ModLogSchema);

const AntiRaidSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, action: { type: String, default: 'kick' }, threshold: { type: Number, default: 5 }, timeWindow: { type: Number, default: 10 } });
const AntiRaidConfig = mongoose.models.AntiRaidConfig || mongoose.model('AntiRaidConfig', AntiRaidSchema);

const VipSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, roleIds: { type: [String], default: [] } });
const VipConfig = mongoose.models.VipConfig || mongoose.model('VipConfig', VipSchema);

const NotificationSchema = new mongoose.Schema({ serverId: String, twitchEnabled: { type: Boolean, default: false }, twitchChannel: { type: String, default: '' }, youtubeEnabled: { type: Boolean, default: false }, youtubeChannel: { type: String, default: '' }, kickEnabled: { type: Boolean, default: false }, kickChannel: { type: String, default: '' }, redditEnabled: { type: Boolean, default: false }, redditChannel: { type: String, default: '' }, notifyChannelId: { type: String, default: '' }, messageTemp: { type: String, default: '[streamer] is now live!' } });
const NotificationConfig = mongoose.models.NotificationConfig || mongoose.model('NotificationConfig', NotificationSchema);

const AutoResponderSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, responses: [{ trigger: String, reply: String }] });
const AutoResponderConfig = mongoose.models.AutoResponderConfig || mongoose.model('AutoResponderConfig', AutoResponderSchema);

const TempChannelSchema = new mongoose.Schema({ serverId: String, enabled: { type: Boolean, default: false }, categoryId: { type: String, default: '' }, setupChannelId: { type: String, default: '' } });
const TempChannelConfig = mongoose.models.TempChannelConfig || mongoose.model('TempChannelConfig', TempChannelSchema);

let isConnected = false;

async function connectToDatabase() {
    if (isConnected) return;
    const uri = process.env.MONGO_URI;
    if (!uri) {
        throw new Error("MONGO_URI is not defined in environment variables. Please set it in Netlify.");
    }
    await mongoose.connect(uri);
    isConnected = true;
}

export const handler = async (event) => {
    if (event.httpMethod === "OPTIONS") {
        return { statusCode: 204, headers: HEADERS, body: "" };
    }

    try {
        await connectToDatabase();
        
        // Basic Authentication Check
        const password = event.headers["x-admin-password"];
        const expectedPassword = process.env.ADMIN_PASSWORD || "K8xmP9vQ2LzY7w";
        if (password !== expectedPassword) {
            return {
                statusCode: 401,
                headers: HEADERS,
                body: JSON.stringify({ error: "Unauthorized" }),
            };
        }

        const serverId = process.env.DISCORD_GUILD_ID || "1531987166048030750"; // Default server ID
        
        if (event.httpMethod === "GET") {
            const automod = await AutoModConfig.findOne({ serverId }) || {};
            const welcome = await WelcomeConfig.findOne({ serverId }) || {};
            const tickets = await TicketConfig.findOne({ serverId }) || {};
            const commands = await CustomCommand.find({ serverId }).lean() || [];
            
            const leveling = await LevelingConfig.findOne({ serverId }) || {};
            const autoroles = await AutoRoleConfig.findOne({ serverId }) || {};
            const colors = await ColorConfig.findOne({ serverId }) || {};
            const selfroles = await SelfRoleConfig.findOne({ serverId }) || {};
            const starboard = await StarboardConfig.findOne({ serverId }) || {};
            const templinks = await TempLinkConfig.findOne({ serverId }) || {};
            const modlogs = await ModLogConfig.findOne({ serverId }) || {};
            const antiraid = await AntiRaidConfig.findOne({ serverId }) || {};
            const vip = await VipConfig.findOne({ serverId }) || {};
            const notifications = await NotificationConfig.findOne({ serverId }) || {};
            const autoresponder = await AutoResponderConfig.findOne({ serverId }) || {};
            const tempchannels = await TempChannelConfig.findOne({ serverId }) || {};

            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify({ 
                    automod, welcome, tickets, commands,
                    leveling, autoroles, colors, selfroles, starboard,
                    templinks, modlogs, antiraid, vip, notifications,
                    autoresponder, tempchannels
                }),
            };
        }

        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body);
            const { type, data } = body;
            
            const updaters = {
                'automod': AutoModConfig,
                'welcome': WelcomeConfig,
                'tickets': TicketConfig,
                'leveling': LevelingConfig,
                'autoroles': AutoRoleConfig,
                'colors': ColorConfig,
                'selfroles': SelfRoleConfig,
                'starboard': StarboardConfig,
                'templinks': TempLinkConfig,
                'modlogs': ModLogConfig,
                'antiraid': AntiRaidConfig,
                'vip': VipConfig,
                'notifications': NotificationConfig,
                'autoresponder': AutoResponderConfig,
                'tempchannels': TempChannelConfig,
            };

            if (updaters[type]) {
                await updaters[type].findOneAndUpdate({ serverId }, data, { upsert: true });
            } else if (type === 'add_command') {
                const cmd = new CustomCommand({
                    serverId,
                    commandName: data.commandName.toLowerCase(),
                    response: data.response
                });
                await cmd.save();
            } else if (type === 'delete_command') {
                await CustomCommand.findByIdAndDelete(data.commandId);
            }

            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify({ success: true }),
            };
        }

        return { statusCode: 405, headers: HEADERS, body: "Method Not Allowed" };
    } catch (err) {
        return {
            statusCode: 500,
            headers: HEADERS,
            body: JSON.stringify({ error: err.message }),
        };
    }
};
