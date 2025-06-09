import fs from "node:fs";
import { confirm, password } from "@inquirer/prompts";
import { CONFIG_PATH } from "../constants.js";
import { createConfig, getConfig, updateConfig } from "../utils/index.js";

const LOGIN_MESSAGE = `
Visit https://github.com/settings/tokens/new to create a Personal Access Token.
      
You will need the following scopes:
- repo (Full control of private repositories)
- read:org (Read-only access to organization membership)
- read:user (Read-only access to user profile data)

If you already have a token, you can enter it below.
`;

export async function login() {
  let config;

  if (fs.existsSync(CONFIG_PATH)) {
    config = getConfig();
  }

  if (config.githubToken) {
    const overwrite = await confirm({
      message:
        "You are already logged in. Do you want to overwrite your token?",
    });

    if (!overwrite) {
      console.log("Login cancelled. Your token remains unchanged.");
      process.exit(0);
    }
  }

  try {
    const token = await password({
      message: LOGIN_MESSAGE,
      mask: "*",
      validate: (input) => {
        if (!input) {
          return "Token cannot be empty.";
        }
        return true;
      },
      transformer: (input) => input.replace(/./g, "*"),
    });

    if (config.githubToken) {
      config.githubToken = token;
      updateConfig(config);
    } else {
      createConfig({
        githubToken: token,
      });
    }

    console.log("Configuration saved in ~/.reviews/config.json");
  } catch (err) {
    if (err && err.name === "ExitPromptError") {
      console.log("Login cancelled by user.");
      process.exit(0);
    } else {
      console.error("An error occurred:", err);
      process.exit(1);
    }
  }
}
