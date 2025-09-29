// services/xTokenService.ts
import axios from "axios";
import { User } from "../models/User";
import { decryptToken, encryptToken } from "./tokendecrypt";

export async function getValidAccessToken(userId: string): Promise<string> {
    const user = await User.findById(userId);
    if (!user?.xAccessToken || !user?.xRefreshToken || !user?.xTokenExpiry) {
        throw new Error("No X account connected");
    }

    const now = new Date();
    // Check if token is expired or about to expire (5 sec buffer)
    if (user.xTokenExpiry.getTime() - now.getTime() > 5000) {
        const decryptedAccess = decryptToken(user.xAccessToken);
        if (!decryptedAccess) throw new Error("Access token corrupted or missing");
        return decryptedAccess;
    }

    // Token expired → refresh it
    const clientId = process.env.X_CLIENT_ID!;
    const clientSecret = process.env.X_CLIENT_SECRET!;
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

    const refresh_token = decryptToken(user.xRefreshToken);
    if (!refresh_token) throw new Error("Refresh token is missing or corrupted");
    const tokenRes = await axios.post(
        "https://api.x.com/2/oauth2/token",
        new URLSearchParams({
            grant_type: "refresh_token",
            refresh_token: refresh_token,
            client_id: process.env.X_CLIENT_ID!,
        }),
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${basicAuth}`
            }
        }
    );

    const { access_token, refresh_token: newRefresh, expires_in } = tokenRes.data;

    // Encrypt and store updated tokens
    const encryptedAccess = encryptToken(access_token);
    const encryptedRefresh = encryptToken(newRefresh);

    user.xAccessToken = encryptedAccess;
    user.xRefreshToken = encryptedRefresh;
    user.xTokenExpiry = new Date(Date.now() + expires_in * 1000);
    await user.save();

    return access_token;
}
