// TODO: get ownder and repo from config
export async function getPullRequests(octokit) {
  return octokit.pulls.list({
    owner: "nplan-io",
    repo: "core",
    state: "open",
    per_page: 100,
  });
}
