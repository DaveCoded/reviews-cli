// TODO: allow configuration for who is on your "team"

import {
  calculateOpenReviewRequests,
  getPullRequests,
  getReviewsByPullRequest,
} from "../lib/index.js";

// TODO: cache org members because they don't change often
export async function list(octokit) {
  // TODO: get org from config
  const { data: orgMembers } = await octokit.orgs.listMembers({
    org: "nplan-io",
  });

  const { data: prs } = await getPullRequests(octokit);

  // Fetch all reviews for all PRs
  const prReviewsList = await Promise.all(
    prs.map(async (pr) => {
      const reviews = await getReviewsByPullRequest(octokit, pr.number);
      return { pr, reviews };
    })
  );

  const reviewCounts = calculateOpenReviewRequests({
    orgMembers,
    prReviewsList,
  });

  console.log("Open review requests by user:");
  Object.entries(reviewCounts).forEach(([user, count]) => {
    console.log(`${user}: ${count} open review requests`);
  });
}
