const { openSync } = require("fs");
const { spawn } = require("child_process");
const path = require("path");

const cwd = process.cwd();
const logPath = path.join(cwd, "expo-web.log");
const out = openSync(logPath, "a");

const child = spawn("npx expo start --web --non-interactive", {
  cwd,
  detached: true,
  shell: true,
  stdio: ["ignore", out, out],
});

child.unref();

console.log(`Expo web server started with PID ${child.pid}`);
console.log(`Logging to ${logPath}`);
