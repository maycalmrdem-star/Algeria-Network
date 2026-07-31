// Netlify serverless function — proxies MEE6 leaderboard to avoid CORS
// Deploy: automatically picked up by Netlify from /netlify/functions/

const GUILD_ID = "1531987166048030750";
const HEADERS  = {
  "Content-Type":                "application/json",
  "Access-Control-Allow-Origin": "*",
  "Cache-Control":               "public, max-age=60", // cache 1 min
};

export const handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  const period = event.queryStringParameters?.period ?? "weekly";

  try {
    // ── Try MEE6 API ──────────────────────────────────────
    const mee6Res = await fetch(
      `https://mee6.xyz/api/plugins/levels/leaderboard/${GUILD_ID}?page=0&limit=50`,
      { headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" } }
    );

    if (mee6Res.ok) {
      const mee6 = await mee6Res.json();
      const players = (mee6.players ?? []).map(p => ({
        id:       p.id,
        username: p.username,
        avatar:   p.avatar
          ? `https://cdn.discordapp.com/avatars/${p.id}/${p.avatar}.webp?size=64`
          : `https://api.dicebear.com/9.x/bottts/svg?seed=${p.username}`,
        xp:           p.xp ?? 0,
        level:        p.level ?? 0,
        message_count: p.message_count ?? 0,
      }));

      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({ source: "mee6", period, players }),
      };
    }

    // ── MEE6 not available — return empty so front-end shows static ──
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ source: "unavailable", period, players: [], hint: `MEE6 status: ${mee6Res.status}` }),
    };

  } catch (err) {
    return {
      statusCode: 200,
      headers: HEADERS,
      body: JSON.stringify({ source: "error", period, players: [], error: err.message }),
    };
  }
};
