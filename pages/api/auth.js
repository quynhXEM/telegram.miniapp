import crypto from "crypto";
import jwt from "jsonwebtoken";

const BOT_TOKEN = process.env.BOT_TOKEN;
const JWT_SECRET = process.env.JWT_SECRET;

function sha256(data) {
  return crypto.createHash("sha256").update(data).digest();
}

function checkTelegramAuth(initData) {
  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash) return false;

  const dataCheck = [...params.entries()]
    .filter(([k]) => k !== "hash")
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([k, v]) => `${k}=${v}`)
    .join("\n");

  const secret = sha256(BOT_TOKEN);
  const hmac = crypto.createHmac("sha256", secret).update(dataCheck).digest("hex");
  return hmac === hash;
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { initData } = req.body;
  if (!checkTelegramAuth(initData)) return res.status(401).json({ error: "invalid initData" });

  const params = new URLSearchParams(initData);
  const userId = params.get("id");
  const firstName = params.get("first_name");

  const token = jwt.sign({ userId, firstName }, JWT_SECRET, { expiresIn: "1h" });

  res.setHeader("Set-Cookie", `sess=${token}; HttpOnly; Path=/; Secure; SameSite=Strict; Max-Age=3600`);
  res.json({ ok: true });
}
