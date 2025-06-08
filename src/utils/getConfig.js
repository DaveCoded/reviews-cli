import fs from "node:fs";
import { CONFIG_PATH } from "../constants.js";

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `Configuration file not found at ${CONFIG_PATH}. Please run 'reviews configure' first.`
    );
  }

  const configContent = fs.readFileSync(CONFIG_PATH, "utf-8");
  try {
    return JSON.parse(configContent);
  } catch (error) {
    throw new Error(`Invalid configuration file: ${error.message}`);
  }
}
