// generateKey.js
import crypto from "crypto";

// Generate a 32-byte key (256 bits) and encode as hex
const key = crypto.randomBytes(32).toString("hex");

console.log("Your TOKEN_ENCRYPTION_KEY:");
console.log(key);
