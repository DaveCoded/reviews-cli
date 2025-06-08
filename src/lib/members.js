export async function getMembers(octokit) {
  // TODO: get org from config
  const { data: orgMembers } = await octokit.orgs.listMembers({
    org: "nplan-io",
  });

  return orgMembers;
}
