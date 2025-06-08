import path from "node:path";

export const CONFIG_DIR = path.resolve(process.env.HOME, ".reviews");
export const CONFIG_PATH = path.resolve(CONFIG_DIR, "config.json");
export const HELP_COMMAND = "reviews help";
