// services/facebookToken.ts

import crypto from "crypto";

const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY!;
const IV_LENGTH = 16;

export function decryptToken(encrypted: string): string | null {
  try {
    const [ivHex, encryptedHex] = encrypted.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const key = Buffer.from(ENCRYPTION_KEY, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (err) {
    console.error("Failed to decrypt token:", err);
    return null;
  }
}
export function encryptToken(token: string): string {
    const iv = crypto.randomBytes(IV_LENGTH);
    const ENCRYPTION = Buffer.from(process.env.TOKEN_ENCRYPTION_KEY!, "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", ENCRYPTION, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    return iv.toString("hex") + ":" + encrypted;
}