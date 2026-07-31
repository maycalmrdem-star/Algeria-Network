import { getStore } from "@netlify/blobs";

export const handler = async (event, context) => {
  const store = getStore("discord_stats");
  
  if (event.httpMethod === "GET") {
    try {
      const stats = await store.get("latest", { type: "json" }) || { topUsers: [], topStudiers: [], roles: [] };
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stats)
      };
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  if (event.httpMethod === "POST") {
    // Basic security: require the ADMIN_PASSWORD in headers
    const authHeader = event.headers['authorization'];
    if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
      return { statusCode: 401, body: JSON.stringify({ error: "Unauthorized" }) };
    }

    try {
      const data = JSON.parse(event.body);
      await store.setJSON("latest", data);
      
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ success: true })
      };
    } catch (e) {
      return { statusCode: 500, body: JSON.stringify({ error: e.message }) };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
