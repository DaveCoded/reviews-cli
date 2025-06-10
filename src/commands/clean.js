import fs from "node:fs";
import { confirm } from "@inquirer/prompts";
import { CONFIG_DIR } from "../constants.js";

export async function clean() {
  if (!CONFIG_DIR) {
    console.error("Configuration directory is not set. Cannot clean.");
    process.exit(1);
  }

  const confirmed = await confirm({
    message: "Are you sure you want to remove all reviews configuration?",
  });

  if (!confirmed) {
    console.log("Clean operation cancelled.");
    process.exit(0);
  }

  fs.rmSync(CONFIG_DIR, { recursive: true, force: true });
  console.log("Removed all config for reviews");
}
