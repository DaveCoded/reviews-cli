export async function addReviewersToPullRequest(
  octokit,
  { prNumber, reviewers }
) {
  await octokit.pulls.requestReviewers({
    // TODO: get owner and repo from config
    owner: "nplan-io",
    repo: "core",
    pull_number: prNumber,
    reviewers,
  });
}

export async function removeReviewersFromPullRequest(
  octokit,
  { prNumber, reviewers }
) {
  await octokit.pulls.removeRequestedReviewers({
    // TODO: get owner and repo from config
    owner: "nplan-io",
    repo: "core",
    pull_number: prNumber,
    reviewers,
  });
}
