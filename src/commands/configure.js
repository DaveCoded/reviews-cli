/*
 * reviews configure: choose something to configure
 * reviews configure --owner <owner> --repo <repo> --favourites <favourites>
 * <favourites> is a comma-separated list of GitHub usernames
 */

import { checkbox, input } from "@inquirer/prompts";
import { getMe, getMembers } from "../lib/index.js";
import { getConfig, updateConfig } from "../utils/index.js";

export async function configure(octokit) {
  const config = getConfig();

  const configuredOwner = config.owner;
  const configuredRepo = config.repo;
  const configuredReviewers = config.favouriteReviewers || [];

  const owner = await input({
    message: "Configure the repository owner:",
    default: configuredOwner ?? "",
    required: true,
  });

  const repo = await input({
    message: "Configure the repository name:",
    default: configuredRepo ?? "",
    required: true,
  });

  let favouriteReviewers = configuredReviewers;

  try {
    const members = await getMembers(octokit, { owner });
    const me = await getMe(octokit);
    const choices = members
      .filter((member) => member.login !== me.login)
      .map((member) => ({
        name: member.login,
        value: member.login,
        checked: configuredReviewers.includes(member.login),
      }));

    favouriteReviewers = await checkbox({
      message: "Choose your favourite reviewers:",
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
