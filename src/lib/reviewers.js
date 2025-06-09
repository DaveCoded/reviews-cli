import { checkbox } from "@inquirer/prompts";
import { getMe } from "./me.js";

export async function addReviewersToPullRequest(
  octokit,
  { prNumber, reviewers }
) {
  try {
    return await octokit.pulls.requestReviewers({
      // TODO: get owner and repo from config
      owner: "nplan-io",
      repo: "core",
      pull_number: prNumber,
      reviewers,
    });
  } catch (error) {
    console.error("Error adding reviewers to pull request:", error);
    process.exit(1);
  }
}

export async function removeReviewersFromPullRequest(
  octokit,
  { prNumber, reviewers }
) {
  try {
    return await octokit.pulls.removeRequestedReviewers({
      // TODO: get owner and repo from config
      owner: "nplan-io",
      repo: "core",
      pull_number: prNumber,
      reviewers,
    });
  } catch (error) {
    console.error("Error removing reviewers from pull request:", error);
    process.exit(1);
  }
}

export async function selectReviewers(octokit, { reviewCounts, pr }) {
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

  return selectedReviewers;
}
