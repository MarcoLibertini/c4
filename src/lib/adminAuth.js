import crypto from "crypto";

const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "c4_admin";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev_secret";

function sign(value) {
  return crypto.createHmac("sha256", SECRET).update(value).digest("hex");
}

export function getAdminToken(cookieStore) {
  // Next 16: cookieStore.get existe
  return cookieStore?.get?.(COOKIE_NAME)?.value || null;
}

export function isValidAdminToken(token) {
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  if (sig !== expected) return false;

  // expira en 7 días
  const ts = Number(payload);
  if (!Number.isFinite(ts)) return false;

  const ageMs = Date.now() - ts;
  if (ageMs > 7 * 24 * 60 * 60 * 1000) return false;

  return true;
}

// ✅ alias para compatibilidad con TODO lo que ya venías usando
export function isAdminFromCookies(cookieStore) {
  const token = getAdminToken(cookieStore);
  return isValidAdminToken(token);
}
