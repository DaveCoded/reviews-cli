// TODO: allow configuration for who is on your "team"
import {
  calculateOpenReviewRequests,
  getAllReviewsByPullRequests,
  getMembers,
  getOpenReviewRequestsForMembers,
  getPullRequests,
} from "../lib/index.js";

// TODO: cache org members because they don't change often
export async function list(octokit) {
  const reviewCounts = await getOpenReviewRequestsForMembers(octokit);

  console.log("Open review requests by user:");
  Object.entries(reviewCounts).forEach(([user, count]) => {
    console.log(`${user}: ${count} open review requests`);
  });
}
