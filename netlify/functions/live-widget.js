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
    const store = getStore({
      name: "discord_live_widget",
      siteID: "60e3457f-0b6b-4262-96a9-fd72603324d6",
      token: process.env.BLOBS_API_TOKEN || "nfc_mCsMe3xjLB2d6DK1NvNvuLuPrBo5qDeq35b2"
    });

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
      if (authHeader !== `Bearer ${process.env.ADMIN_PASSWORD || "K8xmP9vQ2LzY7w"}`) {
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
