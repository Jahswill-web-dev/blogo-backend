// src/services/socialPublisher.ts
import axios from "axios";
import { getValidAccessToken } from "../services/xTokenService";
import { getValidLinkedInAccessToken } from "../services/linkedinTokenService";
import { User } from "../models/User";

/**
 * Publishes a post to the specified platform.
 * @param userId - The ID of the user making the post
 * @param platform - "Linkedin" or "X"
 * @param text - The post text
 * @returns API response or error
 */
const capitalize = (value: string) => {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

export async function publishToSocial(userId: string, platform: string, text: string) {
  try {
    const user = await User.findById(userId);
    if (!user) throw new Error("User not found");
    const formattedPlatform = capitalize(platform);

    if (formattedPlatform === "Linkedin") {
      if (!user.linkedinUrn) throw new Error("LinkedIn not connected");

      const accessToken = await getValidLinkedInAccessToken(userId);

      const postBody = {
        author: user.linkedinUrn,
        lifecycleState: "PUBLISHED",
        specificContent: {
          "com.linkedin.ugc.ShareContent": {
            shareCommentary: { text },
            shareMediaCategory: "NONE",
          },
        },
        visibility: {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };

      const resp = await axios.post("https://api.linkedin.com/v2/ugcPosts", postBody, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "LinkedIn-Version": "202501",
          "X-Restli-Protocol-Version": "2.0.0",
          "Content-Type": "application/json",
        },
      });

      return { formattedPlatform, success: true, data: resp.data };
    }

    if (formattedPlatform === "X") {
      const accessToken = await getValidAccessToken(userId);

      const tweetRes = await axios.post(
        "https://api.x.com/2/tweets",
        { text },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return { platform, success: true, data: tweetRes.data };
    }

    throw new Error(`Unsupported platform: ${platform}`);
  } catch (err: any) {
    console.error(`${platform} publish error:`, err.response?.data || err.message);
    return { platform, success: false, error: err.message };
  }
}
