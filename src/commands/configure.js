// First ask for owner. Populate with config by default.
// Then ask for repo. Populate with config by default.
// Then configure favourite reviewers.

import { checkbox, input } from "@inquirer/prompts";
import { getMe, getMembers } from "../lib/index.js";
import { getConfig, updateConfig } from "../utils/index.js";

const config = getConfig();

export async function configure(octokit) {
  const configuredOwner = config.owner;
  const configuredRepo = config.repo;
  const configuredReviewers = config.favouriteReviewers || [];

  const owner = await input({
    message: "Configure the repository owner:",
    initial: configuredOwner ?? "",
    required: true,
  });

  const repo = await input({
    message: "Configure the repository name:",
    initial: configuredRepo ?? "",
    required: true,
  });

  let favouriteReviewers = configuredReviewers;

  try {
    const members = await getMembers(octokit);
    const me = await getMe(octokit);
    const choices = members
      .filter((member) => member.login !== me.login)
      .map((member) => ({
        name: member.login,
        value: member.login,
        checked: configuredReviewers.includes(member.login),
      }));

    favouriteReviewers = await checkbox({
      message: "Choose your favourite reviewers (comma-separated):",
      choices,
    });
  } catch (error) {
    console.error("Error fetching members:", error);
  }

  // Save the configuration
  updateConfig({
    owner,
    repo,
    favouriteReviewers,
  });
}
