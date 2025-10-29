// src/services/agenda.ts
import Agenda, { Job } from "agenda";
import { publishToSocial } from "./socialPublisher";
import ContentPost from "../models/ContentPost";
import { Types } from "mongoose";

const mongoConnectionString = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";

// Initialize Agenda with MongoDB connection
const agenda = new Agenda({
  db: { address: mongoConnectionString, collection: "scheduledJobs" },
});

// Define the job — this is what Agenda will run at the scheduled time
agenda.define("publish scheduled post", async (job: Job) => {
  const { userId, batchId, postId, platform } = job.attrs.data as any;

  console.log("Running scheduled job:", { userId, platform, postId });

  const batch = await ContentPost.findOne({ userId, batchId });
  if (!batch) {
    console.error("Batch not found for scheduled job");
    return;
  }

  const selectedPost = batch.posts.find((p:{ _id: Types.ObjectId }) => p._id.toString() === postId.toString());
  if (!selectedPost) {
    console.error("Post not found in batch");
    return;
  }

  try {
    const result = await publishToSocial(userId, platform, selectedPost.postText);

    // Optionally mark post as published
    await ContentPost.updateOne(
      { _id: batch._id, "posts._id": postId },
      {
        $set: {
          "posts.$.publishedAt": new Date(),
          "posts.$.isPublished": true,
        },
      }
    );

    console.log("✅ Post published successfully:", result);
  } catch (err: any) {
    console.error("❌ Failed to publish scheduled post:", err.message);
  }
});

// Start Agenda background worker
(async function () {
  await agenda.start();
  console.log("✅ Agenda started and ready to schedule jobs");
})();

export default agenda;
