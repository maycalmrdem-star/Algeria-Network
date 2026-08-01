import { getStore } from "@netlify/blobs";
import crypto from 'crypto';

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type, x-admin-password, x-admin-pin"
};

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }

  try {
    const store = getStore("events");

    if (event.httpMethod === "GET") {
      let data = [];
      try {
        data = await store.get("todays_events", { type: "json" });
      } catch (err) {
        // Blob might not exist yet
      }
      return {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify(data || []),
      };
    }

    if (event.httpMethod === "POST") {
      const password = event.headers["x-admin-password"];
      const pin = event.headers["x-admin-pin"];
      
      const pinHash = crypto.createHash('sha256').update(pin || '').digest('hex');
      const expectedPinHash = "cbfad02f9ed2a8d1e08d8f74f5303e9eb93637d47f82ab6f1c15871cf8dd0481"; // Hash for 1212
      
      const expectedPassword = process.env.ADMIN_PASSWORD || "K8xmP9vQ2LzY7w";

      if (password !== expectedPassword || pinHash !== expectedPinHash) {
        return {
          statusCode: 401,
          headers: HEADERS,
          body: JSON.stringify({ error: "Unauthorized" }),
        };
      }

      const body = JSON.parse(event.body);
      await store.setJSON("todays_events", body.events);

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
