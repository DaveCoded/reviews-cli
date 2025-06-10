import { getConfig } from "../utils/index.js";

// TODO: cache org members because they don't change often
export async function getMembers(octokit, { owner } = {}) {
  const config = getConfig();

  if (!owner && !config.owner) {
    console.log(
      "No owner configured. Run `reviews configure` to set the owner."
    );
    process.exit(0);
  }

  const { data: orgMembers } = await octokit.orgs.listMembers({
    org: owner || config.owner,
  });

  return orgMembers;
}
