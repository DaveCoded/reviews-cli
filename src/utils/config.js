import fs from "node:fs";
import { CONFIG_PATH } from "../constants.js";

export function getConfig() {
  if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `Configuration file not found at ${CONFIG_PATH}. Please run 'reviews login' first.`
    );
  }

  const configContent = fs.readFileSync(CONFIG_PATH, "utf-8");
  try {
    return JSON.parse(configContent);
  } catch (error) {
    throw new Error(`Invalid configuration file: ${error.message}`);
  }
}

export function saveConfig(config) {
  try {
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  } catch (error) {
    throw new Error(`Failed to save configuration: ${error.message}`);
  }
}

// TODO: test this function doesn't overwrite existing config
export function updateConfig(updates) {
  const config = getConfig();
  Object.assign(config, updates);
  saveConfig(config);
  return config;
}

export function createConfig(initialConfig) {
  if (fs.existsSync(CONFIG_PATH)) {
    throw new Error(
      `Configuration file already exists at ${CONFIG_PATH}. Please run 'reviews configure' to update it.`
    );
  }

  fs.mkdirSync(CONFIG_DIR, { recursive: true });
  fs.writeFileSync(CONFIG_PATH, JSON.stringify(initialConfig ?? {}, null, 2));
  console.log("Configuration created successfully.");
}

export function deleteConfig() {
  if (fs.existsSync(CONFIG_PATH)) {
    fs.unlinkSync(CONFIG_PATH);
    console.log("Configuration deleted successfully.");
  } else {
    console.log(
      `Configuration file not found at ${CONFIG_PATH}. Nothing to delete.`
    );
  }
}
