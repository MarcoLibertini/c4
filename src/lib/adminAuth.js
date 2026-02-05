// src/lib/adminAuth.js
import crypto from "crypto";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "c4_admin";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev_secret";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function getAdminToken(cookieStore) {
  // cookieStore viene de: const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value || null;
}

export function isValidAdminToken(token) {
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  if (sig !== expected) return false;

  const ts = Number(payload);
  if (!Number.isFinite(ts)) return false;

  // expira en 7 días
  const ageMs = Date.now() - ts;
  if (ageMs > 7 * 24 * 60 * 60 * 1000) return false;

  return true;
}
