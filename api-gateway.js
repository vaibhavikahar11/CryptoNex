const express = require("express");
const cors = require("cors");
const { createProxyMiddleware } = require("http-proxy-middleware");

// Initialize Express app
const app = express();

// Enable CORS
app.use(
  cors({
    origin: "*",
    credentials: true,
  }),
);

// NOTE: Do NOT use express.json() or express.urlencoded() here!
// Body parsers consume the request stream, which prevents
// http-proxy-middleware from forwarding the body to backend services.

// ============================================
// SERVICE CONFIGURATION
// ============================================
const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:1106";
const BOT_URL = process.env.BOT_URL || "http://localhost:5000";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

console.log("🌍 API Gateway Configuration:");
console.log(`  Backend (Spring Boot):  ${BACKEND_URL}`);
console.log(`  Crypto Bot (Node):      ${BOT_URL}`);
console.log(`  Frontend:               ${FRONTEND_URL}`);

// ============================================
// PROXY ROUTES
// ============================================

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    message: "API Gateway is running",
    timestamp: new Date().toISOString(),
    services: {
      backend: BACKEND_URL,
      bot: BOT_URL,
      frontend: FRONTEND_URL,
    },
  });
});

// ============================================
// AUTH ROUTES (Spring Boot - Java)
// ============================================
app.use(
  "/auth",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/auth",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[AUTH] ${req.method} /auth${req.url.replace("/auth", "")}`);
    },
    onError: (err, req, res) => {
      console.error(`[AUTH ERROR] ${req.method} /auth - ${err.message}`);
      res.status(503).json({ error: "Authentication service unavailable" });
    },
  }),
);


// ============================================
// COINS ROUTES (Spring Boot — public, no auth)
// CoinController mapped at /coins (not /api/coins)
// ============================================
app.use(
  "/coins",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[COINS] ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`[COINS ERROR] ${err.message}`);
      res.status(503).json({ error: "Coin data service unavailable" });
    },
  }),
);

// ============================================
// BOT ROUTES (Crypto Bot - Node.js)
// ============================================
app.use(
  "/chat",
  createProxyMiddleware({
    target: BOT_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/chat": "/chat",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[BOT] ${req.method} /chat${req.url.replace("/chat", "")}`);
    },
    onError: (err, req, res) => {
      console.error(`[BOT ERROR] ${req.method} /chat - ${err.message}`);
      res.status(503).json({ error: "Crypto Bot service unavailable" });
    },
  }),
);

app.use(
  "/usercoins",
  createProxyMiddleware({
    target: BOT_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/usercoins": "/usercoins",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[BOT] ${req.method} /usercoins${req.url.replace("/usercoins", "")}`,
      );
    },
    onError: (err, req, res) => {
      console.error(`[BOT ERROR] ${req.method} /usercoins - ${err.message}`);
      res.status(503).json({ error: "Crypto Bot service unavailable" });
    },
  }),
);

app.use(
  "/usercoinPortfolio",
  createProxyMiddleware({
    target: BOT_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/usercoinPortfolio": "/usercoinPortfolio",
    },
    onProxyReq: (proxyReq, req, res) => {
      console.log(
        `[BOT] ${req.method} /usercoinPortfolio${req.url.replace("/usercoinPortfolio", "")}`,
      );
    },
    onError: (err, req, res) => {
      console.error(
        `[BOT ERROR] ${req.method} /usercoinPortfolio - ${err.message}`,
      );
      res.status(503).json({ error: "Crypto Bot service unavailable" });
    },
  }),
);

// ============================================
// BACKEND ROUTES (Spring Boot - Java)
// ============================================
app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL,
    changeOrigin: true,
    pathRewrite: { "^/api": "/api" },
    onProxyReq: (proxyReq, req, res) => {
      console.log(`[BACKEND] ${req.method} ${req.url}`);
    },
    onError: (err, req, res) => {
      console.error(`[BACKEND ERROR] ${req.method} /api - ${err.message}`);
      res.status(503).json({ error: "Backend service unavailable" });
    },
  }),
);

// ============================================
// ERROR HANDLING
// ============================================
app.use((err, req, res, next) => {
  console.error("❌ Gateway Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message,
    message: "API Gateway Error",
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    error: "Not Found",
    message: `Route ${req.method} ${req.path} does not exist`,
    hint: "Use /health to check API Gateway status",
  });
});

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n✅ API Gateway running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health\n`);
});
