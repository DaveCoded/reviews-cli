import { getConfig, saveConfig } from "../utils/index.js";

export async function getMe(octokit) {
  const config = getConfig();

  if (config?.me) {
    return config.me;
  }

  try {
    const { data: user } = await octokit.users.getAuthenticated();
    config.me = { login: user.login };
    saveConfig(config);
    return user;
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    throw new Error("Failed to retrieve authenticated user information.");
  }
}
