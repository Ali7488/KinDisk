const priorities = { debug: 10, info: 20, warn: 30, error: 40 };
let currentLevel = "info";

function write(level, message, context) {
  if (priorities[level] < priorities[currentLevel]) return;

  const stamp = new Date().toISOString();
  const label = level.toUpperCase().padEnd(5);
  const suffix = context === undefined ? "" : ` | ${JSON.stringify(context)}`;
  const line = `[${stamp}] [${label}] ${message}${suffix}\n`;

  if (level === "warn" || level === "error") {
    process.stderr.write(line);
  } else {
    process.stdout.write(line);
  }
}

export const logger = {
  setLevel(level) {
    if (!(level in priorities)) throw new Error(`Unknown log level: ${level}`);
    currentLevel = level;
  },
  debug(message, context) {
    write("debug", message, context);
  },
  info(message, context) {
    write("info", message, context);
  },
  warn(message, context) {
    write("warn", message, context);
  },
  error(message, context) {
    write("error", message, context);
  },
};
