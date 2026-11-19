#!/usr/bin/env node

const command = process.argv[2];

if (!command || command === "help") {
  console.log("Akshay DMS CLI\n\nCommands:\n  status  Show system status\n  help    Show this help");
} else if (command === "status") {
  console.log("Akshay DMS: initial scaffold ready");
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
