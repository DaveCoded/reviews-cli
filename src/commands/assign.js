import {
  getOpenReviewRequestsForMembers,
  getPullRequests,
} from "../lib/index.js";
import { getCurrentBranch } from "../utils/index.js";
import { select, checkbox } from "@inquirer/prompts";

// TODO: refactor
// TODO: error handling
// TODO: testing
export async function assign(octokit) {
  const branch = getCurrentBranch();

  // TODO: get owner from config
  const { data: prs } = await getPullRequests(octokit, {
    head: `nplan-io:${branch}`,
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

  // Prepare choices for the checkbox prompt
  const reviewerChoices = orgMembers.map((login) => ({
    name: `${login} (${reviewCounts[login]} open requests)`,
    // ? Will this need to be an id instead of username?
    value: login,
    checked: currentReviewers.includes(login),
  }));

  const selectedReviewers = await checkbox({
    message: "Select reviewers to request:",
    choices: reviewerChoices,
  });

  console.log("Selected reviewers:", selectedReviewers);

  // Determine reviewers to add and remove
  const reviewersToAdd = selectedReviewers.filter(
    (r) => !currentReviewers.includes(r)
  );
  const reviewersToRemove = currentReviewers.filter(
    (r) => !selectedReviewers.includes(r)
  );

  // TODO: get owner and repo from config
  const owner = "nplan-io";
  const repo = "core";

  // TODO: test this with a real PR
  // Add reviewers
  if (reviewersToAdd.length > 0) {
    await octokit.pulls.requestReviewers({
      owner,
      repo,
      pull_number: pr.number,
      reviewers: reviewersToAdd,
    });
    console.log(`Requested reviews from: ${reviewersToAdd.join(", ")}`);
  }

  // TODO: test this with a real PR
  // Remove reviewers
  if (reviewersToRemove.length > 0) {
    await octokit.pulls.removeRequestedReviewers({
      owner,
      repo,
      pull_number: pr.number,
      reviewers: reviewersToRemove,
    });
    console.log(
      `Removed review requests from: ${reviewersToRemove.join(", ")}`
    );
  }
}
