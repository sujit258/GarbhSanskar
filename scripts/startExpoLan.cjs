const os = require("os");
const { spawn } = require("child_process");

function getLanIp() {
  const interfaces = os.networkInterfaces();

  for (const entries of Object.values(interfaces)) {
    for (const entry of entries || []) {
      if (
        entry &&
        entry.family === "IPv4" &&
        !entry.internal &&
        !entry.address.startsWith("169.254.")
      ) {
        return entry.address;
      }
    }
  }

  return null;
}

const lanIp = getLanIp();

if (!lanIp) {
  console.error("No LAN IPv4 address found. Connect to Wi-Fi and try again, or use npm run start:tunnel.");
  process.exit(1);
}

console.log(`Using LAN IP: ${lanIp}`);

const child = spawn("npx", ["expo", "start", "--lan"], {
  cwd: process.cwd(),
  shell: true,
  stdio: "inherit",
  env: {
    ...process.env,
    REACT_NATIVE_PACKAGER_HOSTNAME: lanIp,
  },
});

child.on("exit", (code) => {
  process.exit(code ?? 0);
});
