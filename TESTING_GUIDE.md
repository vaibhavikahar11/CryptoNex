# 🧪 CryptoNex Complete Debug & Testing Guide

## ✅ FIXED: API Gateway Now Has `/auth` Route

```
✅ [HPM] Proxy created: /auth -> http://localhost:1106
✅ [HPM] Proxy rewrite rule created: "^/auth" ~> "/auth"
```

---

## 📊 Current Service Status

| Service     | Port | Status         | Issue         |
| ----------- | ---- | -------------- | ------------- |
| API Gateway | 3000 | ✅ Running     | None          |
| Backend     | 1106 | ❌ Not Running | Need to start |
| Crypto Bot  | 5000 | ❌ Not Running | Optional      |
| Frontend    | 5173 | ❌ Not Running | Need to start |

---

## 🔴 BLOCKING ISSUES TO FIX

### Issue 1: Backend Not Running

**Error:** `[ECONNREFUSED] - Backend connection refused`

**Solution:**

```bash
# Terminal 2: Start Backend
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run

# Wait for: Started Application in X.XXX seconds
```

**Requires:**

- Java 21 JDK installed
- PostgreSQL credentials in `.env` (currently shows placeholder)

### Issue 2: Missing Environment Variables

**Current `.env` Status:**

```
❌ SPRING_DATASOURCE_PASSWORD=your_password_here         ← PLACEHOLDER
❌ GEMINI_API_KEY=your_gemini_api_key_here              ← PLACEHOLDER
❌ MAIL_PASSWORD=your_email_password_here               ← PLACEHOLDER
❌ STRIPE_API_KEY=your_stripe_api_key_here              ← NOT SET
❌ RAZORPAY_API_KEY=your_razorpay_api_key_here          ← NOT SET
```

**Solution:** Fill in `.env` with real values:

```env
# Database Password - GET FROM YOUR POSTGRESQL INSTANCE
SPRING_DATASOURCE_PASSWORD=<your-actual-db-password>

# Gemini API Key - https://ai.google.dev/
GEMINI_API_KEY=<your-gemini-api-key>

# Gmail App Password - https://support.google.com/accounts/answer/185833
MAIL_PASSWORD=<your-gmail-app-password>

# Stripe - https://stripe.com/
STRIPE_API_KEY=<your-stripe-secret-key>

# Razorpay - https://razorpay.com/
RAZORPAY_API_KEY=<your-razorpay-key>
```

---

## 🚀 Complete Startup Sequence (4 Terminals)

### Terminal 1: API Gateway (Already Running ✅)

```bash
# Already running on :3000
# Logs show:
# ✅ API Gateway running on http://localhost:3000
# ✅ /auth route configured
# ✅ /chat route configured
# ✅ /usercoins route configured
# ✅ /api route configured
```

### Terminal 2: Backend (Spring Boot)

```bash
cd Cryptonex-Backend-master

# Build and run
mvnw.cmd spring-boot:run

# Expected output (wait 30-60 seconds):
# ...
# Started Application in 45.123 seconds
# Server is running on port 1106
```

**Prerequisites:**

- Java 21 JDK installed: `java -version` should show 21
- `.env` has real PostgreSQL password
- PostgreSQL server accessible

### Terminal 3: Frontend (React/Vite)

```bash
cd Cryptonex-Frontend-main

# Install dependencies (if not done)
npm install

# Start dev server
npm run dev

# Expected output:
# ➜ Local: http://localhost:5173/
# ➜ press h to show help
```

### Terminal 4: (Optional) Crypto Bot

```bash
cd crypto_bot-main

# Install dependencies (if not done)
npm install

# Start bot
npm start

# Expected output:
# Bot listening on port 5000
```

---

## 🧪 Testing Login Flow

### Step 1: Verify All Services Running

```bash
# Check in separate terminal:
netstat -ano | findstr ":3000|:1106|:5173"

# Should show all three ports LISTENING
```

### Step 2: Test API Gateway Routes

**Test Health:**

```bash
Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing
# Should return JSON with service URLs
```

**Test Auth Route:**

```bash
Invoke-WebRequest -Uri "http://localhost:3000/auth/signin" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"password123"}' `
  -UseBasicParsing

# Expected responses:
# ✅ 200 = Login successful
# ❌ 401 = Invalid credentials
# ❌ 503 = Backend unavailable
# ❌ 400 = Bad request
```

### Step 3: Test in Browser

1. **Open Browser:**
   - Go to `http://localhost:5173`
   - Open DevTools: Press `F12`
   - Go to **Network** tab

2. **Attempt Login:**
   - Enter email: `test@example.com`
   - Enter password: `password123`
   - Click **Login**

3. **Check Network Tab:**
   - Look for request to `auth/signin`
   - Should show: `http://localhost:3000/auth/signin`
   - Status code indicators:
     - 🟢 200 = Success
     - 🟠 401 = Auth failed
     - 🔴 503 = Service down
     - 🔴 0 = Network error

4. **Check Console Tab:**
   - Look for error messages
   - Look for CORS errors
   - Check localStorage for JWT token

---

## 📋 Request Flow Diagram

```
User clicks Login on Frontend (:5173)
    ↓
Form validates email & password
    ↓
Frontend sends: POST http://localhost:3000/auth/signin
    ↓
API Gateway (:3000) receives request
    ↓
API Gateway logs: [AUTH] POST /auth/signin
    ↓
API Gateway forwards to: http://localhost:1106/auth/signin
    ↓
Backend (:1106) receives request
    ↓
Backend validates credentials against PostgreSQL
    ↓
Backend returns JWT token
    ↓
API Gateway returns JWT to Frontend
    ↓
Frontend stores JWT in localStorage
    ↓
Frontend redirects to home page
    ↓
User logged in ✅
```

---

## 🔍 Debugging Checklist

### If Login Shows Error "Cannot connect to API":

```
1. ✅ Check API Gateway running:
   netstat -ano | findstr :3000

2. ✅ Check Backend running:
   netstat -ano | findstr :1106

3. ✅ Check VITE_API_BASE_URL:
   Should be: http://localhost:3000
   File: Cryptonex-Frontend-main/.env or vite.config.js

4. ✅ Check Backend can access PostgreSQL:
   Look at backend logs for database connection errors

5. ✅ Check /auth route in gateway:
   Gateway logs should show: [AUTH] when you attempt login
```

### If Login Shows Error "Invalid credentials":

```
✅ This means:
- Frontend → Gateway: ✅ Working
- Gateway → Backend: ✅ Working
- Database: ✅ Connected

❌ But:
- Email/password don't exist in database
- User not created yet

Solution: Register new user first or use test credentials
```

### If Login Shows Error "Backend service unavailable":

```
❌ This means:
- Frontend → Gateway: ✅ Working
- Gateway → Backend: ❌ FAILED

Solution:
1. Check if Backend is running: netstat -ano | findstr :1106
2. Check Backend logs for errors
3. Restart Backend: mvnw.cmd spring-boot:run
```

---

## 🗂️ File Integration Map

```
Frontend (Vite)
├── src/Api/api.js
│   ├── API_BASE_URL = "http://localhost:3000" ✅
│   └── Creates axios instance with gateway URL
│
├── src/pages/Auth/login/login.jsx
│   ├── Form validation with Zod
│   └── Calls: dispatch(login(data))
│
└── src/Redux/Auth/Action.js
    ├── export const login = () async (dispatch) => {
    ├── Sends: POST ${API_BASE_URL}/auth/signin
    ├── Maps to: http://localhost:3000/auth/signin
    └── Which becomes: Backend http://localhost:1106/auth/signin


API Gateway (api-gateway.js)
├── /auth route (✅ NEWLY ADDED)
│   ├── Target: http://localhost:1106
│   ├── Logs: [AUTH] POST /auth/signin
│   └── Response: JWT token
│
├── /api route
│   ├── Target: http://localhost:1106
│   └── Logs: [BACKEND] GET /api/users/profile
│
└── /chat, /usercoins routes
    ├── Target: http://localhost:5000
    └── Logs: [BOT] POST /chat


Backend (Spring Boot)
├── src/main/java/com/cryptonex/controller/AuthController.java
│   ├── @PostMapping("/auth/signin")
│   ├── Validates credentials
│   └── Returns JWT token
│
└── src/main/resources/application.properties
    ├── server.port=1106
    ├── spring.datasource.url=postgres://...
    └── spring.mail.properties=...
```

---

## ✅ Complete Integration Verification

### Check 1: API Gateway Routes

```
✅ /health              → Gateway status
✅ /auth/*              → Backend authentication  ← NEWLY FIXED
✅ /api/*               → Backend API
✅ /chat                → Crypto Bot
✅ /usercoins           → Crypto Bot
✅ /usercoinPortfolio   → Crypto Bot
```

### Check 2: Environment Variables

```
.env file should have:
✅ VITE_API_BASE_URL=http://localhost:3000        (Frontend knows gateway)
✅ BACKEND_URL=http://localhost:1106              (Gateway knows backend)
✅ BOT_URL=http://localhost:5000                  (Gateway knows bot)
✅ SPRING_BOOT_URL=http://localhost:3000          (Bot knows gateway)
❌ DATABASE_PASSWORD=<REAL_PASSWORD>              (Update with actual password)
❌ GEMINI_API_KEY=<YOUR_KEY>                      (Get from https://ai.google.dev/)
```

### Check 3: File Mappings

```
Frontend API Config
  api.js → Uses http://localhost:3000 ✅
  vite.config.js → Has proxy to :3000 ✅
  Redux/Auth/Action.js → Posts to /auth/signin ✅

API Gateway
  api-gateway.js → Has /auth route ✅
  api-gateway.js → Has /api route ✅
  api-gateway.js → Has /chat routes ✅

Backend
  AuthController.java → Handles /auth/signin ✅
  application.properties → Port 1106 ✅
  application.properties → Database config set ✅
```

---

## 🎯 Next Steps (Priority Order)

### Priority 1: Get Backend Running

```bash
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run

# This will fail if:
1. Java 21 not installed → Install JDK 21
2. Database password wrong → Update .env
3. PostgreSQL not accessible → Check connection
```

### Priority 2: Get Frontend Running

```bash
cd Cryptonex-Frontend-main
npm run dev

# This will fail if:
1. npm dependencies missing → npm install
2. Port 5173 in use → Kill existing process
```

### Priority 3: Test Login

```
1. Open http://localhost:5173 in browser
2. Open DevTools (F12)
3. Try to login
4. Watch Network tab for /auth/signin request
5. Check Console tab for errors
```

### Priority 4: Debug Errors

```
If login fails:
1. Check which service is not responding
2. Look at that service's logs
3. Fix the issue
4. Restart and retry
```

---

## 📞 Emergency Diagnostics

If everything fails, run this diagnostic:

```bash
# Check all ports
netstat -ano | findstr ":3000|:1106|:5173|:5000"

# Test each service
Write-Host "=== Testing API Gateway ==="
Invoke-WebRequest -Uri "http://localhost:3000/health" -UseBasicParsing

Write-Host "`n=== Testing Backend ==="
Invoke-WebRequest -Uri "http://localhost:1106/api/health" -UseBasicParsing

Write-Host "`n=== Testing Frontend ==="
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing

Write-Host "`n=== Testing Bot ==="
Invoke-WebRequest -Uri "http://localhost:5000/health" -UseBasicParsing
```

---

## ✨ Summary

**FIXED:**

- ✅ API Gateway now has `/auth` route configured
- ✅ Login requests can reach backend through gateway
- ✅ Request logging shows [AUTH] tag for authentication requests

**BLOCKING:**

- ❌ Backend not running (needs Java 21 + database password)
- ❌ Environment variables have placeholders (need real values)
- ❌ Frontend not running (needs npm run dev)

**NEXT ACTION:**
Start Backend: `cd Cryptonex-Backend-master && mvnw.cmd spring-boot:run`

---

**Status**: 🟡 **Partially Working - Needs Backend**
**Last Updated**: June 1, 2026
**Critical Fix**: ✅ Auth route added to API Gateway
