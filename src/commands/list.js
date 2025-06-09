import { getOpenReviewRequestsForMembers } from "../lib/index.js";

export async function list(octokit) {
  const reviewCounts = await getOpenReviewRequestsForMembers(octokit);

  console.log("Open review requests by user:");
  Object.entries(reviewCounts).forEach(([user, count]) => {
    console.log(`${user}: ${count} open review requests`);
  });
}
