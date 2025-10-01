import axios from "axios";
import { User } from "../models/User";
import { decryptToken, encryptToken } from "./tokendecrypt";

export async function getValidLinkedInAccessToken(userId: string): Promise<string> {
  const user = await User.findById(userId);
  if (!user?.linkedinToken) {
    throw new Error("No LinkedIn account connected");
  }

  const now = new Date();

  // if token not expired, just return
  if (user.linkedinTokenExpiry && user.linkedinTokenExpiry.getTime() > now.getTime() + 5000) {
    const token = decryptToken(user.linkedinToken);
  if (!token) {
    throw new Error("Failed to decrypt LinkedIn token");
  }
  return token;
  }

  // ⚠️ LinkedIn doesn’t always provide refresh tokens unless special approval
  if (!user.linkedinRefreshToken) {
    throw new Error("LinkedIn token expired and no refresh token available");
  }
    const refreshToken = decryptToken(user.linkedinRefreshToken);

    if (!refreshToken) {
        throw new Error("LinkedIn refresh token is corrupted or missing");
    }
  // try refreshing
  const res = await axios.post(
    "https://www.linkedin.com/oauth/v2/accessToken",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: process.env.LINKEDIN_CLIENT_ID!,
      client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
    }),
    { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
  );

  const { access_token, expires_in, refresh_token } = res.data;

  user.linkedinToken = encryptToken(access_token);
  if (refresh_token) {
    user.linkedinRefreshToken = encryptToken(refresh_token);
  }
  user.linkedinTokenExpiry = new Date(Date.now() + expires_in * 1000);
  await user.save();

  return access_token;
}
