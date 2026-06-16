/**
 * CryptoNex Full-Stack Orchestrator
 * Starts all 4 services: API Gateway, Frontend, Crypto Bot, Spring Boot Backend
 * Run with: npm start
 */

const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

// ─── Load root .env ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, ".env");
const rootEnv = {};
if (fs.existsSync(envPath)) {
  const lines = fs.readFileSync(envPath, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    rootEnv[key] = val;
    // Unconditionally set the environment variable to ensure .env takes precedence
    process.env[key] = val;
  }
}

// ─── Resolve Java 21 path (always use the Eclipse Adoptium JDK 21) ────────────
const JAVA_HOME_21 = "C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.11.10-hotspot";
const javaBin21 = path.join(JAVA_HOME_21, "bin");

// ─── Root paths ───────────────────────────────────────────────────────────────
const ROOT = __dirname;
const FRONTEND_DIR = path.join(ROOT, "Cryptonex-Frontend-main");
const BOT_DIR = path.join(ROOT, "crypto_bot-main");
const BACKEND_DIR = path.join(ROOT, "Cryptonex-Backend-master");

// ─── Colour helpers ───────────────────────────────────────────────────────────
const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  gateway: "\x1b[44m\x1b[97m",  // Blue bg, white text
  frontend: "\x1b[42m\x1b[30m", // Green bg, black text
  bot: "\x1b[45m\x1b[97m",      // Magenta bg, white text
  backend: "\x1b[46m\x1b[30m",  // Cyan bg, black text
  info: "\x1b[36m",
  success: "\x1b[32m",
  warn: "\x1b[33m",
  error: "\x1b[31m",
};

function prefix(label, color) {
  return `${color} ${label.padEnd(8)} ${C.reset} `;
}

function logLines(label, color, msg) {
  const lines = String(msg).replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");
  for (const line of lines) {
    if (line.trim()) process.stdout.write(prefix(label, color) + line + "\n");
  }
}

function banner() {
  const b = C.bold + C.info;
  console.log(`\n${b}╔══════════════════════════════════════════════════════╗`);
  console.log(`${b}║       🚀  CryptoNex Full-Stack Launcher              ║`);
  console.log(`${b}╠══════════════════════════════════════════════════════╣`);
  console.log(`${b}║  ${C.reset}${C.gateway} GATEWAY  ${C.reset}${b}  → http://localhost:3000               ║`);
  console.log(`${b}║  ${C.reset}${C.frontend} FRONTEND ${C.reset}${b}  → http://localhost:5173               ║`);
  console.log(`${b}║  ${C.reset}${C.bot} BOT      ${C.reset}${b}  → http://localhost:5000               ║`);
  console.log(`${b}║  ${C.reset}${C.backend} BACKEND  ${C.reset}${b}  → http://localhost:1106               ║`);
  console.log(`${b}╠══════════════════════════════════════════════════════╣`);
  console.log(`${b}║  Press Ctrl+C to stop all services                   ║`);
  console.log(`${b}╚══════════════════════════════════════════════════════╝${C.reset}\n`);
}

// ─── Spawn helper ─────────────────────────────────────────────────────────────
const processes = [];

function startService({ label, color, cmd, args, cwd, env }) {
  const proc = spawn(cmd, args, {
    cwd,
    env,
    stdio: ["ignore", "pipe", "pipe"],
    shell: true, // use shell:true so Windows resolves .cmd/.bat files correctly
    windowsHide: true,
  });

  processes.push({ label, proc });

  proc.stdout.on("data", (d) => logLines(label, color, d.toString()));
  proc.stderr.on("data", (d) => logLines(label, color, d.toString()));

  proc.on("error", (err) => {
    console.error(`${C.error}[${label}] Failed to start: ${err.message}${C.reset}`);
  });

  proc.on("close", (code) => {
    if (code !== 0 && code !== null) {
      console.warn(`${C.warn}[${label}] exited with code ${code}${C.reset}`);
    }
  });

  return proc;
}

// ─── Build isolated envs per service ─────────────────────────────────────────

/** Base system env without PORT (each service sets its own) */
function baseEnv(overrides = {}) {
  const env = { ...process.env, ...overrides };
  return env;
}

/** Gateway env: PORT=3000 */
function gatewayEnv() {
  return baseEnv({
    PORT: "3000",
    BACKEND_URL: rootEnv.BACKEND_URL || "http://localhost:1106",
    BOT_URL: rootEnv.BOT_URL || "http://localhost:5000",
    FRONTEND_URL: rootEnv.FRONTEND_URL || "http://localhost:5173",
  });
}

/** Bot env: PORT=5000 explicitly, SPRING_BOOT_URL points to gateway */
function botEnv() {
  return baseEnv({
    PORT: "5000",
    NODE_ENV: "development",
    GEMINI_API_KEY: rootEnv.GEMINI_API_KEY || "",
    COINGECKO_API_KEY: rootEnv.COINGECKO_API_KEY || "",
    CRYPTOPANIC_API_KEY: rootEnv.CRYPTOPANIC_API_KEY || "",
    SPRING_BOOT_URL: "http://localhost:3000",
  });
}

/** Frontend env: Vite config picks these up */
function frontendEnv() {
  return baseEnv({
    VITE_API_BASE_URL: rootEnv.VITE_API_BASE_URL || "http://localhost:3000",
    VITE_APP_NAME: rootEnv.VITE_APP_NAME || "CryptoNex",
    VITE_APP_VERSION: rootEnv.VITE_APP_VERSION || "1.0.0",
  });
}

/** Backend env: Java 21, all Spring env vars, PATH includes java bin */
function backendEnv() {
  const systemPath = process.env.PATH || process.env.Path || "";
  const newPath = javaBin21 + path.delimiter + systemPath;
  return baseEnv({
    JAVA_HOME: JAVA_HOME_21,
    PATH: newPath,
    Path: newPath,
    // Spring Boot env vars
    SPRING_DATASOURCE_URL: rootEnv.SPRING_DATASOURCE_URL || "",
    SPRING_DATASOURCE_USERNAME: rootEnv.SPRING_DATASOURCE_USERNAME || "",
    SPRING_DATASOURCE_PASSWORD: rootEnv.SPRING_DATASOURCE_PASSWORD || "",
    SPRING_JPA_HIBERNATE_DDL_AUTO: rootEnv.SPRING_JPA_HIBERNATE_DDL_AUTO || "update",
    SPRING_MAIL_HOST: rootEnv.SPRING_MAIL_HOST || "smtp.gmail.com",
    SPRING_MAIL_PORT: rootEnv.SPRING_MAIL_PORT || "587",
    MAIL_USERNAME: rootEnv.MAIL_USERNAME || "",
    MAIL_PASSWORD: rootEnv.MAIL_PASSWORD || "",
    SPRING_MAIL_PROPERTIES_MAIL_SMTP_AUTH: "true",
    SPRING_MAIL_PROPERTIES_MAIL_SMTP_STARTTLS_ENABLE: "true",
    STRIPE_API_KEY: rootEnv.STRIPE_API_KEY || "",
    RAZORPAY_API_KEY: rootEnv.RAZORPAY_API_KEY || "",
    RAZORPAY_API_SECRET: rootEnv.RAZORPAY_API_SECRET || "",
    GEMINI_API_KEY: rootEnv.GEMINI_API_KEY || "",
    COINGECKO_API_KEY: rootEnv.COINGECKO_API_KEY || "",
    GOOGLE_CLIENT_ID: rootEnv.GOOGLE_CLIENT_ID || "",
    GOOGLE_CLIENT_SECRET: rootEnv.GOOGLE_CLIENT_SECRET || "",
    SERVER_PORT: "1106",
  });
}

// ─── Service launchers ────────────────────────────────────────────────────────

function startGateway() {
  logLines("GATEWAY", C.gateway, "Starting API Gateway on port 3000...");
  return startService({
    label: "GATEWAY",
    color: C.gateway,
    cmd: "node",
    args: ["api-gateway.js"],
    cwd: ROOT,
    env: gatewayEnv(),
  });
}

function startCryptoBot() {
  logLines("BOT", C.bot, "Starting Crypto Bot on port 5000...");
  return startService({
    label: "BOT",
    color: C.bot,
    cmd: "node",
    args: ["index.js"],
    cwd: BOT_DIR,
    env: botEnv(),
  });
}

function startFrontend() {
  logLines("FRONTEND", C.frontend, "Starting React/Vite dev server on port 5173...");
  return startService({
    label: "FRONTEND",
    color: C.frontend,
    cmd: "npm",
    args: ["run", "dev"],
    cwd: FRONTEND_DIR,
    env: frontendEnv(),
  });
}

function startBackend() {
  logLines("BACKEND", C.backend, "Starting Spring Boot backend on port 1106...");
  logLines("BACKEND", C.backend, `JAVA_HOME → ${JAVA_HOME_21}`);
  logLines("BACKEND", C.backend, "⏳ First compile may take 30-90 seconds...");
  // Use run-backend.bat which correctly resolves mvnw.cmd even when cwd has spaces
  return startService({
    label: "BACKEND",
    color: C.backend,
    cmd: "run-backend.bat",
    args: [],
    cwd: BACKEND_DIR,
    env: backendEnv(),
  });
}

// ─── Graceful shutdown ────────────────────────────────────────────────────────
let shutdownCalled = false;
function shutdown() {
  if (shutdownCalled) return;
  shutdownCalled = true;
  console.log(`\n${C.warn}⚠️  Shutting down all CryptoNex services...${C.reset}`);
  for (const { label, proc } of processes) {
    try {
      spawn("taskkill", ["/pid", String(proc.pid), "/f", "/t"], {
        stdio: "ignore",
        shell: true,
        windowsHide: true,
      });
      console.log(`${C.info}  ✓ Stopped [${label}] (pid ${proc.pid})${C.reset}`);
    } catch (_) {}
  }
  setTimeout(() => process.exit(0), 1500);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

// ─── Launch ───────────────────────────────────────────────────────────────────
banner();
startGateway();
setTimeout(() => startCryptoBot(), 800);
setTimeout(() => startFrontend(), 1200);
setTimeout(() => startBackend(), 1800);

console.log(
  `${C.success}✅ All services launching... Watch for each service's ready message above.${C.reset}\n`
);
