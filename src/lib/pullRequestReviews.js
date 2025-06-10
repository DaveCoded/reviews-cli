import { getConfig } from "../utils/index.js";
import { getMembers } from "./members.js";
import { getPullRequests } from "./pullRequests.js";

async function getReviewsByPullRequest(octokit, pullNumber) {
  const config = getConfig();
  if (!config.owner || !config.repo) {
    console.log(
      "No owner or repo configured. Run `reviews configure` to set them."
    );
    process.exit(0);
  }

  const { owner, repo } = config;

  const { data: reviews } = await octokit.pulls.listReviews({
    owner,
    repo,
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

  for (const { pr } of prReviewsList) {
    const requestedReviewers = pr.requested_reviewers
      .filter((r) => orgLogins.has(r.login))
      .map((r) => r.login);

    for (const reviewer of requestedReviewers) {
      reviewCounts[reviewer] += 1;
    }
  }

  return reviewCounts;
}

function orderCountsByFavouriteReviewers(reviewCounts) {
  const config = getConfig();
  const favouriteReviewers = config.favouriteReviewers || [];
  const orderedReviewCounts = {};

  // Add favourite reviewers first, if present in reviewCounts
  for (const reviewer of favouriteReviewers) {
    if (reviewCounts[reviewer] !== undefined) {
      orderedReviewCounts[reviewer] = reviewCounts[reviewer];
    }
  }

  // Add remaining reviewers not already added
  for (const reviewer in reviewCounts) {
    if (
      reviewCounts.hasOwnProperty(reviewer) &&
      !orderedReviewCounts.hasOwnProperty(reviewer)
    ) {
      orderedReviewCounts[reviewer] = reviewCounts[reviewer];
    }
  }

  return orderedReviewCounts;
}

export async function getOpenReviewRequestsForMembers(octokit) {
  const orgMembers = await getMembers(octokit);
  const { data: prs } = await getPullRequests(octokit);
  const prReviewsList = await getAllReviewsByPullRequests(octokit, prs);

  const reviewCounts = calculateOpenReviewRequests({
    orgMembers,
    prReviewsList,
  });

  const orderedReviewCounts = orderCountsByFavouriteReviewers(reviewCounts);

  return orderedReviewCounts;
}
