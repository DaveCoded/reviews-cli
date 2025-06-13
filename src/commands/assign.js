import {
  addReviewersToPullRequest,
  getOpenReviewRequestsForMembers,
  getPullRequests,
  removeReviewersFromPullRequest,
  selectPR,
  selectReviewers,
} from "../lib/index.js";
import { buildHead, formatList, getCurrentBranch } from "../utils/index.js";

export async function assign(octokit) {
  const currentBranch = getCurrentBranch();

  const { data: prs } = await getPullRequests(octokit, {
    head: buildHead(currentBranch),
  });

  if (prs.length === 0) {
    console.log("No open PRs found for the current branch.");
    process.exit(0);
  }

  const pr = await selectPR(prs);

  const reviewCounts = await getOpenReviewRequestsForMembers(octokit);
  const currentReviewers = pr.requested_reviewers.map((r) => r.login);

  const selectedReviewers = await selectReviewers(octokit, {
    reviewCounts,
    pr,
  });

  // Determine reviewers to add and remove
  const reviewersToAdd = selectedReviewers.filter(
    (r) => !currentReviewers.includes(r)
  );
  const reviewersToRemove = currentReviewers.filter(
    (r) => !selectedReviewers.includes(r)
  );

  if (reviewersToAdd.length > 0) {
    await addReviewersToPullRequest(octokit, {
      prNumber: pr.number,
      reviewers: reviewersToAdd,
    });
    console.log(`Requested reviews from: ${formatList(reviewersToAdd)}`);
  }

  if (reviewersToRemove.length > 0) {
    await removeReviewersFromPullRequest(octokit, {
      prNumber: pr.number,
      reviewers: reviewersToRemove,
    });
    console.log(
      `Removed review requests from: ${formatList(reviewersToRemove)}`
    );
  }
}
