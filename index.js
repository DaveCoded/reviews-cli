#! /usr/bin/env node

// TODO: move file to bin
import { Octokit } from "@octokit/rest";
import { assign, configure, login, list } from "./src/commands/index.js";
import { validateConfig, validateCommand } from "./src/lib/index.js";
import { getConfig } from "./src/utils/index.js";

const commands = {
  assign,
  configure,
  login,
  list,
};

const command = process.argv[2];

validateCommand({ command, commands });

if (command === "login") {
  await commands[command]();
}

validateConfig();

const config = getConfig();

// Create client for making requests to GitHub API
const octokit = new Octokit({ auth: config.githubToken });

commands[command](octokit);
