import { getMembers } from "./members.js";
import { getPullRequests } from "./pullRequests.js";

// TODO: get owner and repo from config
async function getReviewsByPullRequest(octokit, pullNumber) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: "nplan-io",
    repo: "core",
    pull_number: pullNumber,
    per_page: 100,
  });
  return reviews;
}

export async function getAllReviewsByPullRequests(octokit, prs) {
  return await Promise.all(
    prs.map(async (pr) => {
      const reviews = await getReviewsByPullRequest(octokit, pr.number);
      return { pr, reviews };
    })
  );
}

export function calculateOpenReviewRequests({ orgMembers, prReviewsList }) {
  const orgLogins = new Set(orgMembers.map((member) => member.login));

  const reviewCounts = {};
  for (const member of orgMembers) {
    reviewCounts[member.login] = 0;
  }

  for (const { pr, reviews } of prReviewsList) {
    const requestedReviewers = pr.requested_reviewers
      .filter((r) => orgLogins.has(r.login))
      .map((r) => r.login);

    if (requestedReviewers.length === 0) continue;

    // For each requested reviewer, check if they have approved
    for (const reviewer of requestedReviewers) {
      const hasApproved = reviews.some(
        (review) =>
          review.user &&
          review.user.login === reviewer &&
          review.state === "APPROVED"
      );

      if (!hasApproved) {
        reviewCounts[reviewer] += 1;
      }
    }
  }

  return reviewCounts;
}

export async function getOpenReviewRequestsForMembers(octokit) {
  const orgMembers = await getMembers(octokit);
  const { data: prs } = await getPullRequests(octokit);
  const prReviewsList = await getAllReviewsByPullRequests(octokit, prs);

  const reviewCounts = calculateOpenReviewRequests({
    orgMembers,
    prReviewsList,
  });

  return reviewCounts;
}
