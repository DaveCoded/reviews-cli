// TODO: get owner and repo from config
export async function getPullRequests(octokit, options = {}) {
  return octokit.pulls.list({
    owner: "nplan-io",
    repo: "core",
    state: "open",
    per_page: 100,
    ...options,
  });
}
