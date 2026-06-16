# 🔍 CryptoNex Debug Report & Checklist

## ❌ Issues Found

### 1. **API Gateway Status**

- Last start attempt: Exit code 1 (failed)
- Need to restart and verify it's running

### 2. **Missing/Invalid Environment Variables**

```
SPRING_DATASOURCE_PASSWORD=your_password_here        ❌ PLACEHOLDER
GEMINI_API_KEY=your_gemini_api_key_here             ❌ PLACEHOLDER
MAIL_PASSWORD=your_email_password_here              ❌ PLACEHOLDER
STRIPE_API_KEY=your_stripe_api_key_here             ❌ NOT SET
RAZORPAY_API_KEY=your_razorpay_api_key_here         ❌ NOT SET
```

### 3. **Services Not Running**

- Backend (Spring Boot on :1106) - NOT RUNNING
- Crypto Bot (Node.js on :5000) - NOT RUNNING
- Frontend (React on :5173) - NOT RUNNING

### 4. **Login Flow Chain**

```
Frontend (:5173)
  ↓ POST /auth/signin
API Gateway (:3000) ← MUST BE RUNNING
  ↓ forwards to
Backend (:1106) ← MUST BE RUNNING
  ↓
PostgreSQL Database ← MUST BE ACCESSIBLE
  ↓
Returns JWT Token
```

---

## 🔧 Quick Diagnostic Script

```bash
# Check all required ports
Write-Host "Checking port availability..."
netstat -ano | findstr ":3000|:1106|:5000|:5173"

# Check API Gateway response
Write-Host "`nTesting API Gateway..."
Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing

# Check Backend response
Write-Host "`nTesting Backend..."
Invoke-WebRequest -Uri "http://localhost:1106/api/health" -UseBasicParsing

# Check Crypto Bot response
Write-Host "`nTesting Crypto Bot..."
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
```

---

## 📋 Step-by-Step Debug Checklist

### Step 1: Verify Gateway is Running

```bash
# Terminal 1 - Check gateway
netstat -ano | findstr :3000

# If running, you should see:
# TCP    0.0.0.0:3000    LISTENING    <PID>

# If NOT running, start it:
npm start
```

### Step 2: Verify Backend Database Connection

```bash
# Check .env file for DATABASE CREDENTIALS
# File: .env
# Line: SPRING_DATASOURCE_PASSWORD=

# ❌ CURRENT: your_password_here
# ✅ SHOULD BE: Your actual PostgreSQL password

# Database: cryptonex_e9gg on dpg-cvqevvjipnbc73crbqt0-a.oregon-postgres.render.com
```

### Step 3: Verify API Keys

```
GEMINI_API_KEY         ❌ MISSING - Backend Bot chat won't work
STRIPE_API_KEY         ❌ MISSING - Payment won't work
RAZORPAY_API_KEY       ❌ MISSING - Payment won't work
MAIL_PASSWORD          ❌ MISSING - Email notifications won't work
```

### Step 4: Check Login Endpoint Mapping

**Frontend (Vite) → API Configuration:**

```javascript
// File: Cryptonex-Frontend-main/src/Api/api.js
const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://cryptonex-backend.onrender.com"
    : "http://localhost:3000"; // ✅ CORRECT
```

**Login Action → Endpoint:**

```javascript
// File: Cryptonex-Frontend-main/src/Redux/Auth/Action.js
const response = await axios.post(`${API_BASE_URL}/auth/signin`, userData);
// Maps to: http://localhost:3000/auth/signin
```

**API Gateway → Backend:**

```javascript
// File: api-gateway.js
app.use(
  "/api",
  createProxyMiddleware({
    target: BACKEND_URL, // = http://localhost:1106
    changeOrigin: true,
    pathRewrite: { "^/api": "/api" },
  }),
);
// BUT: /auth/signin is NOT under /api prefix!
```

---

## ⚠️ **CRITICAL ISSUE FOUND!**

### Login Request Path Mismatch

**Frontend sends:**

```
POST http://localhost:3000/auth/signin
```

**But API Gateway has NO route for `/auth`!**

API Gateway routes:

- ✅ `/api/*` → Backend
- ✅ `/chat/*` → Bot
- ✅ `/usercoins/*` → Bot
- ❌ `/auth/*` → **NOT DEFINED**

**Solution:** Auth routes need to be added to API Gateway!

---

## 🔧 Fix Required Files

### File 1: api-gateway.js

Add AUTH route before other routes:

```javascript
// ADD THIS SECTION AFTER /health endpoint:

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
      res.status(503).json({ error: "Auth service unavailable" });
    },
  }),
);
```

---

## 📊 Complete Service Mapping

| Endpoint             | Frontend Sends          | Gateway Routes To       | Backend Handles |
| -------------------- | ----------------------- | ----------------------- | --------------- |
| `/auth/signin`       | :3000/auth/signin       | :1106/auth/signin       | AuthController  |
| `/auth/signup`       | :3000/auth/signup       | :1106/auth/signup       | AuthController  |
| `/api/users/profile` | :3000/api/users/profile | :1106/api/users/profile | UserController  |
| `/chat`              | :3000/chat              | :5000/chat              | Bot             |

---

## ✅ Pre-Flight Checklist

Before testing login, verify ALL of these:

- [ ] API Gateway running on :3000
- [ ] Backend running on :1106
- [ ] Crypto Bot running on :5000 (optional for login)
- [ ] Frontend running on :5173
- [ ] `.env` has real database password (not placeholder)
- [ ] `.env` has Gemini API key (for bot chat)
- [ ] Gateway has `/auth` route configured
- [ ] Browser DevTools Network tab shows requests going to :3000

---

## 🚀 Complete Startup Sequence

```bash
# Terminal 1: API Gateway
npm start
# Wait for: ✅ API Gateway running on http://localhost:3000

# Terminal 2: Backend (Java)
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run
# Wait for: Started Application in X seconds

# Terminal 3: Crypto Bot (Node.js)
cd crypto_bot-main
npm start
# Wait for: Bot listening on port 5000

# Terminal 4: Frontend (React)
cd Cryptonex-Frontend-main
npm run dev
# Wait for: Local: http://localhost:5173/

# Terminal 5: Test in Browser
# Open: http://localhost:5173
# DevTools: F12 → Network tab
# Try to login and watch requests
```

---

## 🧪 Test Login with curl

After all services are running:

```bash
# Test 1: Check if backend is reachable through gateway
Invoke-WebRequest -Uri "http://localhost:3000/auth/signin" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}' `
  -UseBasicParsing

# Test 2: Check backend directly (if gateway fails)
Invoke-WebRequest -Uri "http://localhost:1106/auth/signin" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}' `
  -UseBasicParsing
```

---

## 📝 Environment Variables - What's Missing

```
# ✅ SET
VITE_API_BASE_URL=http://localhost:3000       ← Frontend API
BACKEND_URL=http://localhost:1106             ← Gateway knows backend
BOT_URL=http://localhost:5000                 ← Gateway knows bot
SPRING_BOOT_URL=http://localhost:3000         ← Bot knows gateway

# ❌ NOT SET (Placeholders)
SPRING_DATASOURCE_PASSWORD=your_password_here
GEMINI_API_KEY=your_gemini_api_key_here
MAIL_PASSWORD=your_email_password_here
STRIPE_API_KEY=your_stripe_api_key_here
RAZORPAY_API_KEY=your_razorpay_api_key_here
```

**You need to fill these with actual values for:**

- Database to accept connections
- Gemini AI to work for chatbot
- Email notifications
- Payment processing

---

## 🔍 Browser DevTools Debugging

When testing login:

1. **Open DevTools** (F12)
2. Go to **Network** tab
3. Click **Login** button
4. Look for request to `auth/signin`
   - Should show: `http://localhost:3000/auth/signin`
   - Status should be: 200 (success) or 401 (auth failed) or 503 (service down)

5. Go to **Console** tab
   - Check for error messages
   - Look for CORS errors
   - Check JWT token storage

---

## 📋 Summary of Issues

| Issue                       | Impact              | Solution                         |
| --------------------------- | ------------------- | -------------------------------- |
| No `/auth` route in gateway | Login fails         | Add auth route to api-gateway.js |
| Backend not running         | 503 error           | Start backend with mvnw.cmd      |
| Missing DB password         | Connection fails    | Update .env with real password   |
| Missing API keys            | Features won't work | Get keys from services           |
| API Gateway not running     | All requests fail   | Start with npm start             |

---

## 🎯 Next Actions (In Order)

1. **Fix API Gateway** → Add `/auth` route
2. **Verify .env** → Check all credentials
3. **Start Backend** → Spring Boot on :1106
4. **Start Frontend** → Vite on :5173
5. **Test Login** → Try to authenticate
6. **Check Network** → DevTools shows requests to :3000
7. **Debug Errors** → Console tab for messages

---

**Status**: 🔴 **Multiple Issues Found - Needs Fixes**
**Priority**: ⚠️ **HIGH - Login completely broken due to missing /auth route**
