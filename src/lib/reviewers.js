import { checkbox } from "@inquirer/prompts";
import { getMe } from "./me.js";
import { getConfig } from "../utils/index.js";

export async function addReviewersToPullRequest(
  octokit,
  { prNumber, reviewers }
) {
  const config = getConfig();

  if (!config.owner || !config.repo) {
    console.error(
      "No owner or repo configured. Run `reviews configure` to set the owner and repo."
    );
    process.exit(1);
  }

  const { owner, repo } = config;

  try {
    return await octokit.pulls.requestReviewers({
      owner,
      repo,
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
  const config = getConfig();

  if (!config.owner || !config.repo) {
    console.error(
      "No owner or repo configured. Run `reviews configure` to set the owner and repo."
    );
    process.exit(1);
  }

  const { owner, repo } = config;

  try {
    return await octokit.pulls.removeRequestedReviewers({
      owner,
      repo,
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
