import { execSync } from "child_process";
import { getConfig } from "./config.js";

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
  const config = getConfig();

  if (!config.owner) {
    console.log(
      "No owner configured. Run `reviews configure` to set the owner."
    );
    process.exit(0);
  }

  return `${config.owner}:${branch}`;
}
