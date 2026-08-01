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

  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body);
      const password = body.password;
      const pin = body.pin;
      
      const pinHash = crypto.createHash('sha256').update(pin || '').digest('hex');
      const expectedPinHash = "cbfad02f9ed2a8d1e08d8f74f5303e9eb93637d47f82ab6f1c15871cf8dd0481"; // Hash for 1212
      
      const expectedPassword = process.env.ADMIN_PASSWORD || "K8xmP9vQ2LzY7w";

      if (password === expectedPassword && pinHash === expectedPinHash) {
        return {
          statusCode: 200,
          headers: HEADERS,
          body: JSON.stringify({ success: true, message: "تم تسجيل الدخول بنجاح" }),
        };
      }

      return {
        statusCode: 401,
        headers: HEADERS,
        body: JSON.stringify({ success: false, message: "بيانات الدخول غير صحيحة" }),
      };
    } catch (err) {
      return {
        statusCode: 400,
        headers: HEADERS,
        body: JSON.stringify({ success: false, message: "حدث خطأ أثناء معالجة الطلب" }),
      };
    }
  }

  return { statusCode: 405, headers: HEADERS, body: "Method Not Allowed" };
};
