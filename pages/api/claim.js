import jwt from "jsonwebtoken";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const cookie = req.headers.cookie || "";
  const match = cookie.match(/sess=([^;]+)/);
  if (!match) return res.status(401).json({ error: "no session" });

  try {
    const payload = jwt.verify(match[1], process.env.JWT_SECRET);
    return res.json({ ok: true, message: `🎉 ${payload.firstName} đã nhận 10 điểm` });
  } catch (e) {
    return res.status(401).json({ error: "invalid session" });
  }
}
