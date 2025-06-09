import { select } from "@inquirer/prompts";

// TODO: get owner and repo from config
export async function getPullRequests(octokit, options = {}) {
  try {
    return octokit.pulls.list({
      owner: "nplan-io",
      repo: "core",
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
