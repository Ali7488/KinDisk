import { styleText } from "node:util";

const priorities = { debug: 10, info: 20, warn: 30, error: 40 };
const levelStyles = {
  debug: "magenta",
  info: "cyan",
  warn: "yellow",
  error: "red",
};
let currentLevel = "info";

// styleText drops colors automatically when the stream is not a TTY or NO_COLOR is set.
// Set FORCE_COLOR=1 to keep colors when piping output.
function paint(format, text, stream) {
  return styleText(format, text, { stream });
}

function write(level, message, context) {
  if (priorities[level] < priorities[currentLevel]) return;

  const stream = level === "warn" || level === "error" ? process.stderr : process.stdout;
  const stamp = paint("gray", `[${new Date().toISOString()}]`, stream);
  const label = paint(["bold", levelStyles[level]], `[${level.toUpperCase().padEnd(5)}]`, stream);
  const body = level === "error" ? paint("red", message, stream) : message;

  // A `stack` field is printed on its own lines instead of inside the JSON.
  const { stack, ...rest } = context ?? {};
  const hasContext = context !== undefined && Object.keys(rest).length > 0;
  const suffix = hasContext ? ` ${paint("dim", `| ${JSON.stringify(rest)}`, stream)}` : "";
  const trace = stack ? `\n${paint("dim", String(stack), stream)}` : "";

  stream.write(`${stamp} ${label} ${body}${suffix}${trace}\n`);
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
  // Colors an HTTP status for request logs: 2xx green, 3xx cyan, 4xx yellow, 5xx red.
  status(code, stream = process.stdout) {
    const color = code >= 500 ? "red" : code >= 400 ? "yellow" : code >= 300 ? "cyan" : "green";
    return paint(["bold", color], String(code), stream);
  },
};
