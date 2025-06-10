#! /usr/bin/env node

import { Octokit } from "@octokit/rest";
import {
  assign,
  clean,
  configure,
  login,
  list,
} from "../src/commands/index.js";
import { validateConfig, validateCommand } from "../src/lib/index.js";
import { getConfig } from "../src/utils/index.js";

const commands = {
  assign,
  clean,
  configure,
  login,
  list,
};

const command = process.argv[2];

validateCommand({ command, commands });

if (command === "login") {
  await commands.login();
  process.exit(0);
}

validateConfig();

const config = getConfig();

// Create client for making requests to GitHub API
const octokit = new Octokit({ auth: config.githubToken });

commands[command](octokit);
