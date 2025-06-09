import { select, checkbox } from "@inquirer/prompts";
import {
  addReviewersToPullRequest,
  removeReviewersFromPullRequest,
  getMe,
  getOpenReviewRequestsForMembers,
  getPullRequests,
} from "../lib/index.js";
import { buildHead, getCurrentBranch } from "../utils/index.js";

// TODO: refactor
// TODO: error handling
// TODO: testing
export async function assign(octokit) {
  const branch = getCurrentBranch();

  const { data: prs } = await getPullRequests(octokit, {
    head: buildHead(branch),
  });

  if (prs.length === 0) {
    console.log("No open PRs found for the current branch.");
    return;
  }

  let pr;

  // If there's more than one PR, prompt the user to select one
  if (prs.length > 1) {
    // TODO: test this by creating multiple PRs for the same branch at work
    const choices = prs.map((pr, index) => ({
      name: `${index + 1}: ${pr.title} (#${pr.number})`,
      value: index,
    }));
    const selectedIdx = await select({
      message: "Multiple PRs found for the current branch. Please select one:",
      choices,
    });
    pr = prs[selectedIdx];
  } else {
    // If there's only one PR, use that
    pr = prs[0];
  }

  console.log(`Selected PR: ${pr.title} (#${pr.number})`);
  console.log(
    `Reviewers requested: ${pr.requested_reviewers.map((r) => r.login).join(", ")}`
  );

  const reviewCounts = await getOpenReviewRequestsForMembers(octokit);

  const orgMembers = Object.keys(reviewCounts);
  // Currently requested reviewers for the selected PR
  const currentReviewers = pr.requested_reviewers.map((r) => r.login);

  const me = await getMe(octokit);

  // Prepare choices for the checkbox prompt
  const reviewerChoices = orgMembers
    .filter((login) => login !== me.login) // Exclude the current user
    .map((login) => ({
      name: `${login} (${reviewCounts[login]} open requests)`,
      value: login,
      checked: currentReviewers.includes(login),
    }));

  const selectedReviewers = await checkbox({
    message: "Select reviewers to request:",
    choices: reviewerChoices,
  });

  // Determine reviewers to add and remove
  const reviewersToAdd = selectedReviewers.filter(
    (r) => !currentReviewers.includes(r)
  );
  const reviewersToRemove = currentReviewers.filter(
    (r) => !selectedReviewers.includes(r)
  );

  // TODO: test this with a real PR
  if (reviewersToAdd.length > 0) {
    await addReviewersToPullRequest(octokit, {
      prNumber: pr.number,
      reviewers: reviewersToAdd,
    });
    console.log(`Requested reviews from: ${reviewersToAdd.join(", ")}`);
  }

  // TODO: test this with a real PR
  if (reviewersToRemove.length > 0) {
    await removeReviewersFromPullRequest(octokit, {
      prNumber: pr.number,
      reviewers: reviewersToRemove,
    });
    console.log(
      `Removed review requests from: ${reviewersToRemove.join(", ")}`
    );
  }
}
