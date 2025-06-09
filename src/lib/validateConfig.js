import fs from "node:fs";
import { CONFIG_PATH } from "../constants.js";

export function validateConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    console.error(
      "No config found. Run `reviews login` to set up your GitHub token."
    );
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

  if (!config.githubToken) {
    console.error(
      "No GitHub token found. Run `reviews login` to set up your GitHub token."
    );
    process.exit(1);
  }
}
