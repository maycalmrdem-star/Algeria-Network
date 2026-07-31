import { getStore } from "@netlify/blobs";

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, authorization"
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  try {
    const store = getStore("discord_live_widget");

    if (event.httpMethod === "GET") {
      let data = null;
      try {
        data = await store.get("latest", { type: "json" });
      } catch (err) {}
      
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(data || { channels: [], members: [], presence_count: 0 }),
      };
    }

    if (event.httpMethod === "POST") {
      const authHeader = event.headers['authorization'];
      if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD}`) {
        return {
          statusCode: 401,
          headers: HEADERS,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      const body = JSON.parse(event.body);
      await store.setJSON("latest", body);

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
