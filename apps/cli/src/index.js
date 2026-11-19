#!/usr/bin/env node

const command = process.argv[2];

const help = `Akshay DMS CLI

Commands:
  status          Show system status
  inventory       List inventory usage
  customer list   Show customer module status
  sale list       Show sales module status
  service list    Show service module status
  help            Show this help`;

if (!command || command === "help") {
  console.log(help);
} else if (command === "status") {
  console.log("Akshay DMS API: configure the Supabase environment variables before use");
} else if (["inventory", "customer", "sale", "service"].includes(command)) {
  console.log(`${command.charAt(0).toUpperCase() + command.slice(1)} module: available through the shared API`);
} else {
  console.error(`Unknown command: ${command}`);
  process.exit(1);
}
