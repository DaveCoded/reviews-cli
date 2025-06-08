// TODO: get owner and repo from config
export async function getReviewsByPullRequest(octokit, pullNumber) {
  const { data: reviews } = await octokit.pulls.listReviews({
    owner: "nplan-io",
    repo: "core",
    pull_number: pullNumber,
    per_page: 100,
  });
  return reviews;
}

export function calculateOpenReviewRequests({ orgMembers, prReviewsList }) {
  const orgLogins = new Set(orgMembers.map((member) => member.login));

  const reviewCounts = {};
  for (const member of orgMembers) {
    reviewCounts[member.login] = 0;
  }

  for (const { pr, reviews } of prReviewsList) {
    const requestedReviewers = pr.requested_reviewers
      .filter((r) => orgLogins.has(r.login))
      .map((r) => r.login);

    if (requestedReviewers.length === 0) continue;

    // For each requested reviewer, check if they have approved
    for (const reviewer of requestedReviewers) {
      const hasApproved = reviews.some(
        (review) =>
          review.user &&
          review.user.login === reviewer &&
          review.state === "APPROVED"
      );

      if (!hasApproved) {
        reviewCounts[reviewer] += 1;
      }
    }
  }

  return reviewCounts;
}
