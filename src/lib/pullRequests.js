import { select } from "@inquirer/prompts";
import { getConfig } from "../utils/index.js";

export async function getPullRequests(octokit, options = {}) {
  const config = getConfig();
  if (!config.owner || !config.repo) {
    console.log(
      "No owner or repo configured. Run `reviews configure` to set them."
    );
    process.exit(0);
  }

  const { owner, repo } = config;

  try {
    return octokit.pulls.list({
      owner,
      repo,
      state: "open",
      per_page: 100,
      ...options,
    });
  } catch (error) {
    console.error("Error fetching pull requests:", error);
    process.exit(1);
  }
}

export async function selectPR(prs) {
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

    return prs[selectedIdx];
  } else {
    // If there's only one PR, use that
    return prs[0];
  }
}
