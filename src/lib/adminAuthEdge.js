// src/lib/adminAuthEdge.js
const COOKIE_NAME = process.env.ADMIN_COOKIE_NAME || "c4_admin";
const SECRET = process.env.ADMIN_COOKIE_SECRET || "dev_secret";

function hexToBytes(hex) {
  if (!hex || typeof hex !== "string") return null;
  const clean = hex.trim();
  if (clean.length % 2 !== 0) return null;

  const out = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

function bytesToHex(bytes) {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hmacSha256Hex(message, secret) {
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

function isExpired(payload) {
  const ts = Number(payload);
  if (!Number.isFinite(ts)) return true;

  const ageMs = Date.now() - ts;
  return ageMs > 7 * 24 * 60 * 60 * 1000; // 7 días
}

export async function isAdminFromRequestEdge(req) {
  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  // expiración
  if (isExpired(payload)) return false;

  // firma
  const expected = await hmacSha256Hex(payload, SECRET);
  return sig === expected;
}
