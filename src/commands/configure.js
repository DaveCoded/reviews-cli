import fs from "node:fs";
import { password } from "@inquirer/prompts";
import { CONFIG_DIR, CONFIG_PATH } from "../constants.js";

// TODO: Provide link to create a PAT
// TODO: check if there's already a token and ask user if they want to overwrite it
// TODO: work out how to configure org and repo -> store in config as an array. Have a command to switch between them
export async function configure() {
  const token = await password({
    message: "Enter your GitHub Personal Access Token",
  });
  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(
    CONFIG_PATH,
    JSON.stringify({ githubToken: token }, null, 2)
  );
  console.log("Configuration saved in ~/.reviews/config.json");
}
