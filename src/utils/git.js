import { execSync } from "child_process";

/**
 * Returns the name of the currently checked out git branch.
 */
export function getCurrentBranch() {
  try {
    const branch = execSync("git rev-parse --abbrev-ref HEAD", {
      encoding: "utf-8",
    }).trim();
    return branch;
  } catch (err) {
    throw new Error("Failed to get current git branch. Are you in a git repo?");
  }
}

export function buildHead(branch) {
  const owner = "nplan-io"; // TODO: get owner from config
  return `${owner}:${branch}`;
}
