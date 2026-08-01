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

            return {
                statusCode: 200,
                headers: HEADERS,
                body: JSON.stringify({ automod, welcome, tickets, commands }),
            };
        }

        if (event.httpMethod === "POST") {
            const body = JSON.parse(event.body);
            const { type, data } = body;
            
            if (type === 'automod') {
                await AutoModConfig.findOneAndUpdate({ serverId }, data, { upsert: true });
            } else if (type === 'welcome') {
                await WelcomeConfig.findOneAndUpdate({ serverId }, data, { upsert: true });
            } else if (type === 'tickets') {
                await TicketConfig.findOneAndUpdate({ serverId }, data, { upsert: true });
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
