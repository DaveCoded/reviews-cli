import { HELP_COMMAND } from "../constants.js";

export function validateCommand({ command, commands }) {
  if (!command) {
    console.error("No command provided.");
    console.log(`Run ${HELP_COMMAND} to see available commands.`);
    process.exit(1);
  }

  if (!commands[command]) {
    console.error(`Unknown command: ${command}`);
    console.log(`Run ${HELP_COMMAND} to see available commands.`);
    process.exit(1);
  }
}
