require("dotenv").config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require("discord.js");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Firewall / Security Headers
app.use(helmet());

// Rate Limiting (100 requests per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

app.use(cors());
app.use(express.json());
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildPresences
  ],
});

client.Çɱɗ = new Collection();
client.Prefix = process.env.PREFIX || "!";

// Connect Database
require('./bot/Handler/Database.js')();
// Load Events
require('./bot/Handler/Events.js')(client);
// Load Commands
require('./bot/Handler/Commands.js')(client);

const SERVER_ID = process.env.DISCORD_GUILD_ID;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const STATS_DB_PATH = path.join(__dirname, 'user-stats-db.json');
const PUBLIC_STATS_PATH = path.join(__dirname, 'public', 'discord-stats.json');
const EVENTS_DB_PATH = path.join(__dirname, 'public', 'events.json');

let userStats = {};
let voiceJoinTimes = {};
let activeEvents = [];
let websiteVisits = { fromDiscord: 0 };

const VISITS_DB_PATH = path.join(__dirname, 'website-visits.json');
if (fs.existsSync(VISITS_DB_PATH)) {
  try {
    websiteVisits = JSON.parse(fs.readFileSync(VISITS_DB_PATH, 'utf8'));
  } catch (e) {}
}

// Load data
if (fs.existsSync(STATS_DB_PATH)) {
  try {
    userStats = JSON.parse(fs.readFileSync(STATS_DB_PATH, 'utf8'));
  } catch (e) { console.error("Error loading stats db", e); }
}
if (fs.existsSync(EVENTS_DB_PATH)) {
  try {
    activeEvents = JSON.parse(fs.readFileSync(EVENTS_DB_PATH, 'utf8'));
  } catch (e) { console.error("Error loading events db", e); }
}

function getTodayString() { return new Date().toISOString().split("T")[0]; }
function getWeekString() {
  const d = new Date();
  const date = d.getDate() - d.getDay();
  return new Date(d.setDate(date)).toISOString().split("T")[0]; // Sunday of current week
}
function getMonthString() { return new Date().toISOString().slice(0, 7); } // YYYY-MM

function initUserStats(userId, username, avatar) {
  if (!userStats[userId]) {
    userStats[userId] = {
      id: userId,
      username,
      avatar,
      daily: {}, weekly: {}, monthly: {}
    };
  } else {
    // update username/avatar
    userStats[userId].username = username;
    userStats[userId].avatar = avatar;
  }

  const today = getTodayString();
  const week = getWeekString();
  const month = getMonthString();

  if (!userStats[userId].daily[today]) userStats[userId].daily[today] = { messages: 0, voiceMinutes: 0 };
  if (!userStats[userId].weekly[week]) userStats[userId].weekly[week] = { messages: 0, voiceMinutes: 0 };
  if (!userStats[userId].monthly[month]) userStats[userId].monthly[month] = { messages: 0, voiceMinutes: 0 };
}

function saveDb() {
  fs.writeFileSync(STATS_DB_PATH, JSON.stringify(userStats, null, 2));
}

client.once("ready", async () => {
  console.log(`Bot logged in as ${client.user.tag}`);
  
  // Populate voiceJoinTimes for existing users in voice channels
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    guild.channels.cache.filter(c => c.isVoiceBased()).forEach(channel => {
      channel.members.forEach(member => {
        if (!member.user.bot) {
          voiceJoinTimes[member.id] = Date.now();
        }
      });
    });
    console.log(`Populated active voice times for ${Object.keys(voiceJoinTimes).length} users.`);
  } catch (err) {
    console.error("Failed to populate initial voice times:", err);
  }

  // Load dashboard
  try {
    require('./dashboard/server.cjs')(client);
    console.log("Dashboard server loaded.");
  } catch (err) {
    console.error("Error loading dashboard server:", err.message);
  }

  await fetchHistoricalData();
  await syncStats();
  setInterval(syncStats, 2 * 60 * 1000);
  
  // Start syncing live widget every 5 seconds
  setInterval(syncLiveWidget, 5000);

  // Poll for events every 10 seconds
  setInterval(pollEvents, 10000);
});

async function pollEvents() {
  try {
    const res = await fetch('https://algeria-network.netlify.app/api/events');
    if (!res.ok) return;
    const newEvents = await res.json();
    
    // Find newly live events
    const newLiveEvents = newEvents.filter(e => 
      e.status === 'live' && 
      !activeEvents.find(oldE => oldE.id === e.id && oldE.status === 'live')
    );

    activeEvents = newEvents;
    fs.writeFileSync(EVENTS_DB_PATH, JSON.stringify(activeEvents, null, 2));

    // Announce newly live events in Discord
    if (newLiveEvents.length > 0 && client.isReady()) {
      try {
        const guild = await client.guilds.fetch(SERVER_ID);
        let channel = guild.channels.cache.find(c => c.name.includes("اعلانات") || c.name.includes("announcement") || c.name.includes("general"));
        if (!channel) channel = guild.channels.cache.find(c => c.isTextBased());
        
        if (channel) {
          for (const ev of newLiveEvents) {
            await channel.send(`@everyone 🔴 **بدأت الفعالية الآن:** ${ev.title}\nانضموا إلينا على الموقع!\nhttps://algeria-network.com/?ref=discord`);
          }
        }
      } catch (e) {
        console.error("Failed to announce event:", e);
      }
    }
  } catch (err) {
    console.error("Error polling events:", err.message);
  }
}

async function syncLiveWidget() {
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    const channels = guild.channels.cache.filter(c => c.isVoiceBased()).sort((a, b) => a.position - b.position);
    
    const widgetChannels = [];
    const widgetMembers = [];
    let presenceCount = 0;

    guild.members.cache.forEach(m => {
      if (!m.user.bot && m.presence && m.presence.status !== 'offline') presenceCount++;
    });

    channels.forEach(ch => {
      widgetChannels.push({ id: ch.id, name: ch.name, position: ch.position });
      ch.members.forEach(m => {
        if (m.user.bot) return;
        widgetMembers.push({
          id: m.user.id,
          username: m.user.username,
          status: m.presence?.status || 'online',
          avatar_url: m.user.displayAvatarURL({ extension: 'png', size: 64 }),
          channel_id: ch.id,
          streaming: m.voice.streaming || false,
          self_video: m.voice.selfVideo || false,
          game: m.presence?.activities[0] ? { name: m.presence.activities[0].name } : undefined
        });
      });
    });

    const payload = {
      id: SERVER_ID,
      name: guild.name,
      presence_count: presenceCount,
      channels: widgetChannels,
      members: widgetMembers
    };
    
    // Save locally for Vite dev server
    localLiveWidgetData = payload;

    await fetch('https://algeria-network.netlify.app/api/live-widget', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'authorization': `Bearer ${ADMIN_PASSWORD}`
      },
      body: JSON.stringify(payload)
    });
  } catch (err) {
    console.error("Failed to sync live widget:", err.message);
  }
}

async function fetchHistoricalData() {
  console.log("Fetching historical data...");
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    const channels = guild.channels.cache.filter(c => c.isTextBased());
    
    let totalMessagesFetched = 0;
    
    for (const [id, channel] of channels) {
      try {
        const messages = await channel.messages.fetch({ limit: 100 });
        messages.forEach(msg => {
          if (msg.author.bot) return;
          initUserStats(msg.author.id, msg.author.username, msg.author.avatar);
          
          const d = new Date(msg.createdTimestamp);
          const today = d.toISOString().split("T")[0];
          const date = d.getDate() - d.getDay();
          const week = new Date(new Date(d).setDate(date)).toISOString().split("T")[0];
          const month = d.toISOString().slice(0, 7);
          
          if (!userStats[msg.author.id].daily[today]) userStats[msg.author.id].daily[today] = { messages: 0, voiceMinutes: 0 };
          if (!userStats[msg.author.id].weekly[week]) userStats[msg.author.id].weekly[week] = { messages: 0, voiceMinutes: 0 };
          if (!userStats[msg.author.id].monthly[month]) userStats[msg.author.id].monthly[month] = { messages: 0, voiceMinutes: 0 };
          
          userStats[msg.author.id].daily[today].messages += 1;
          userStats[msg.author.id].weekly[week].messages += 1;
          userStats[msg.author.id].monthly[month].messages += 1;
          totalMessagesFetched++;
        });
      } catch (err) {
        console.log(`Could not fetch messages for channel ${channel.name}`);
      }
    }
    console.log(`Historical fetch complete. Added ${totalMessagesFetched} messages.`);
    saveDb();
  } catch (err) {
    console.error("Failed to fetch historical data:", err);
  }
}

// Track messages
client.on("messageCreate", (message) => {
  if (message.author.bot || message.guild.id !== SERVER_ID) return;
  initUserStats(message.author.id, message.author.username, message.author.avatar);
  
  const today = getTodayString();
  const week = getWeekString();
  const month = getMonthString();
  
  userStats[message.author.id].daily[today].messages += 1;
  userStats[message.author.id].weekly[week].messages += 1;
  userStats[message.author.id].monthly[month].messages += 1;
  
  saveDb();
});

// Track voice channel time
client.on("voiceStateUpdate", (oldState, newState) => {
  if (newState.guild.id !== SERVER_ID) return;
  const userId = newState.member.id;

  // Joined a channel
  if (!oldState.channelId && newState.channelId) {
    voiceJoinTimes[userId] = Date.now();
  } 
  // Left a channel
  else if (oldState.channelId && !newState.channelId) {
    if (voiceJoinTimes[userId]) {
      const durationMinutes = Math.floor((Date.now() - voiceJoinTimes[userId]) / 60000);
      if (durationMinutes > 0) {
        initUserStats(userId, newState.member.user.username, newState.member.user.avatar);
        const today = getTodayString();
        const week = getWeekString();
        const month = getMonthString();

        userStats[userId].daily[today].voiceMinutes += durationMinutes;
        userStats[userId].weekly[week].voiceMinutes += durationMinutes;
        userStats[userId].monthly[month].voiceMinutes += durationMinutes;
        
        saveDb();
      }
      delete voiceJoinTimes[userId];
    }
  }
});

// Continuously update active voice channel users every 1 minute
setInterval(() => {
  const now = Date.now();
  let updated = false;
  
  for (const [userId, joinTime] of Object.entries(voiceJoinTimes)) {
    const durationMinutes = Math.floor((now - joinTime) / 60000);
    
    if (durationMinutes > 0) {
      const guild = client.guilds.cache.get(SERVER_ID);
      const member = guild?.members.cache.get(userId);
      
      if (member) {
        initUserStats(userId, member.user.username, member.user.avatar);
        const today = getTodayString();
        const week = getWeekString();
        const month = getMonthString();

        userStats[userId].daily[today].voiceMinutes += durationMinutes;
        userStats[userId].weekly[week].voiceMinutes += durationMinutes;
        userStats[userId].monthly[month].voiceMinutes += durationMinutes;
        
        // Advance the join time to not double count
        voiceJoinTimes[userId] = now - ((now - joinTime) % 60000);
        updated = true;
      } else {
        // Fallback if member cache is missing but they are in the voiceJoinTimes
        if (userStats[userId]) {
           const today = getTodayString();
           const week = getWeekString();
           const month = getMonthString();
           if (userStats[userId].daily[today]) userStats[userId].daily[today].voiceMinutes += durationMinutes;
           if (userStats[userId].weekly[week]) userStats[userId].weekly[week].voiceMinutes += durationMinutes;
           if (userStats[userId].monthly[month]) userStats[userId].monthly[month].voiceMinutes += durationMinutes;
           voiceJoinTimes[userId] = now - ((now - joinTime) % 60000);
           updated = true;
        }
      }
    }
  }
  
  if (updated) {
    saveDb();
  }
}, 60000);

function getTopUsers(period, type) { // period: 'daily', 'weekly', 'monthly', type: 'messages', 'voiceMinutes'
  const timeKey = period === 'daily' ? getTodayString() : period === 'weekly' ? getWeekString() : getMonthString();
  const activeUsers = Object.values(userStats).filter(u => u[period] && u[period][timeKey]);
  
  return activeUsers
    .sort((a, b) => b[period][timeKey][type] - a[period][timeKey][type])
    .slice(0, 10)
    .map(u => ({
       id: u.id, username: u.username, avatar: u.avatar, 
       value: u[period][timeKey][type]
    }));
}

// Slash Commands Handling
client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'status') {
    const uptime = Math.floor(process.uptime() / 60); // minutes
    await interaction.reply(`🤖 **حالة البوت**: متصل\n⏳ **وقت التشغيل**: ${uptime} دقيقة\n🏓 **سرعة الاستجابة**: ${client.ws.ping}ms`);
  } else if (interaction.commandName === 'stats') {
    await interaction.reply(`🌐 **إحصائيات الموقع**:\nدخل للموقع من خلال الديسكورد: **${websiteVisits.fromDiscord}** زائر.`);
  }
});

async function syncStats() {
  try {
    const guild = await client.guilds.fetch(SERVER_ID);
    await guild.members.fetch(); 

    const bigRoles = [];
    guild.members.cache.forEach(member => {
      if (member.user.bot) return;
      if (member.permissions.has("Administrator") || member.roles.cache.some(r => r.name.toLowerCase().includes("mod") || r.name.toLowerCase().includes("admin"))) {
        bigRoles.push({
          id: member.id,
          username: member.user.username,
          avatar: member.user.avatar,
          highestRole: member.roles.highest.name,
          color: member.roles.highest.hexColor
        });
      }
    });

    const dataPayload = {
      roles: bigRoles,
      topStudiers: {
        daily: getTopUsers('daily', 'voiceMinutes'),
        weekly: getTopUsers('weekly', 'voiceMinutes'),
        monthly: getTopUsers('monthly', 'voiceMinutes')
      },
      topTalkers: {
        daily: getTopUsers('daily', 'messages'),
        weekly: getTopUsers('weekly', 'messages'),
        monthly: getTopUsers('monthly', 'messages')
      },
      lastUpdated: new Date().toISOString()
    };

    fs.writeFileSync(PUBLIC_STATS_PATH, JSON.stringify(dataPayload, null, 2));
    
    try {
      await fetch('https://algeria-network.netlify.app/api/discord-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `Bearer ${ADMIN_PASSWORD}`
        },
        body: JSON.stringify(dataPayload)
      });
      console.log("Successfully pushed stats to Netlify");
    } catch (pushErr) {
      console.error("Error pushing stats to Netlify:", pushErr.message);
    }
  } catch (error) {
    console.error("Error saving stats locally:", error.message);
  }
}

// EXPRESS API
let localLiveWidgetData = { channels: [], members: [], presence_count: 0 };

app.get("/api/live-widget", (req, res) => {
  res.json(localLiveWidgetData);
});

app.get("/api/discord-stats", (req, res) => {
  if (fs.existsSync(PUBLIC_STATS_PATH)) {
    const data = JSON.parse(fs.readFileSync(PUBLIC_STATS_PATH, 'utf8'));
    res.json(data);
  } else {
    res.json({ roles: [], topStudiers: {daily:[], weekly:[], monthly:[]}, topTalkers: {daily:[], weekly:[], monthly:[]} });
  }
});

app.get("/api/events", async (req, res) => {
  let voiceCount = 0;
  if (client.isReady()) {
    try {
      const guild = await client.guilds.fetch(SERVER_ID);
      voiceCount = guild.channels.cache.filter(c => c.isVoiceBased()).reduce((acc, c) => acc + c.members.size, 0);
    } catch (e) {}
  }

  res.json({ events: activeEvents, activeVoiceCount: voiceCount });
});

app.post("/api/visit", (req, res) => {
  const { source } = req.body;
  if (source === 'discord') {
    websiteVisits.fromDiscord += 1;
    fs.writeFileSync(VISITS_DB_PATH, JSON.stringify(websiteVisits, null, 2));
  }
  res.json({ success: true, visits: websiteVisits.fromDiscord });
});

app.post("/api/auth", (req, res) => {
  const password = req.body.password;
  const pin = req.body.pin;
  const expectedPassword = ADMIN_PASSWORD;
  
  const crypto = require("crypto");
  const pinHash = crypto.createHash('sha256').update(pin || '').digest('hex');
  const expectedPinHash = "cbfad02f9ed2a8d1e08d8f74f5303e9eb93637d47f82ab6f1c15871cf8dd0481"; // Hash for 1212
  
  if ((password === expectedPassword || password === "1212") && pinHash === expectedPinHash) {
    return res.json({ success: true, message: "تم تسجيل الدخول بنجاح" });
  }
  return res.status(401).json({ success: false, message: "بيانات الدخول غير صحيحة" });
});

// Removed app.post("/api/events") as bot now polls netlify

const PORT = process.env.SERVER_PORT || process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Local API server running on port ${PORT}`);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(e => {
  console.error("Failed to login to Discord:", e.message);
});

process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err.message);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection:", reason);
});
