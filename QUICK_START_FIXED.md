# 🚀 Quick Start Guide - CryptoNex (Fixed)

## ⚡ 5-Minute Setup

### **Prerequisites**

- Node.js 16+ (`npm -v`)
- Java 21 (`java -version`)
- PostgreSQL connection (in `.env`)

### **Step 1: Install Dependencies**

```bash
npm install
cd Cryptonex-Frontend-main && npm install && cd ..
cd crypto_bot-main && npm install && cd ..
```

### **Step 2: Check .env Configuration**

```bash
# Verify these key values in .env:
VITE_API_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:1106
BOT_URL=http://localhost:5000
PORT=3000
```

### **Step 3: Start Everything**

```bash
npm start
```

### **Step 4: Wait for Startup** ⏳

- First run: 60-90 seconds (Java compilation)
- Subsequent runs: 15-20 seconds

Watch for these messages:

```
✅ API Gateway running on http://localhost:3000
✅ Frontend React dev server ready at http://localhost:5173
✅ Crypto Bot listening on port 5000
✅ Spring Boot Application started
```

### **Step 5: Open App**

```
http://localhost:5173
```

---

## 🎯 What You Should See

### **On First Load:**

```
┌─────────────────────────────────┐
│                                 │
│         CryptoNex               │
│                                 │
│        ⏳ Initializing...        │
│        Starting backend services│
│        (may take up to 90s)    │
│                                 │
└─────────────────────────────────┘
```

### **After Loading (No Token):**

- Login/Signup forms appear

### **After Login:**

- Dashboard with portfolio, market, wallet, etc.

---

## 🔍 Quick Diagnostics

### **Test 1: API Gateway**

```bash
curl http://localhost:3000/health
```

Should return JSON with `status: ok`

### **Test 2: Services Running**

```bash
check-health.bat
```

### **Test 3: Backend Direct**

```bash
curl http://localhost:1106/health
```

### **Test 4: Browser Console**

Press F12, go to Console tab, look for:

```
[getUser] ✅ User loaded successfully
```

---

## ⚠️ Common Issues

| Issue                    | Fix                                  |
| ------------------------ | ------------------------------------ |
| Blank page with spinner  | Wait 90s, check backend logs         |
| "Cannot reach API"       | Check gateway on port 3000           |
| Login fails              | Verify database connection in `.env` |
| "npm not found"          | Install Node.js                      |
| Port 3000 already in use | `netstat -ano \| findstr :3000`      |

---

## 📁 Project Structure

```
CryptoNex-main/
├── Cryptonex-Backend-master/       Java Spring Boot (Port 1106)
├── Cryptonex-Frontend-main/        React/Vite (Port 5173)
├── crypto_bot-main/                Node.js Bot (Port 5000)
├── api-gateway.js                  Express Gateway (Port 3000)
├── start.js                        Orchestrator
├── .env                            Configuration
└── check-health.bat                Service checker
```

---

## 🔧 Individual Service Commands

```bash
# Backend only
npm run start:backend

# Frontend only
npm run start:frontend

# Bot only
npm run start:bot

# Gateway only
npm run start:gateway

# All together
npm start
```

---

## 💾 Environment Variables

**Critical for running:**

```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://host/dbname
SPRING_DATASOURCE_USERNAME=user
SPRING_DATASOURCE_PASSWORD=pass

# API Gateway
VITE_API_BASE_URL=http://localhost:3000
BACKEND_URL=http://localhost:1106
BOT_URL=http://localhost:5000

# Payment APIs
STRIPE_API_KEY=your_key
RAZORPAY_API_KEY=your_key

# Email
MAIL_USERNAME=your_email
MAIL_PASSWORD=your_app_password

# External APIs
GEMINI_API_KEY=your_key
COINGECKO_API_KEY=your_key
```

---

## 🐳 Docker Alternative

```bash
# Build and run with Docker
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

---

## 📊 Ports Overview

| Service     | Port | URL                   |
| ----------- | ---- | --------------------- |
| Frontend    | 5173 | http://localhost:5173 |
| API Gateway | 3000 | http://localhost:3000 |
| Backend     | 1106 | http://localhost:1106 |
| Bot         | 5000 | http://localhost:5000 |

---

## ✅ Verification Checklist

- [ ] `npm install` completed without errors
- [ ] `.env` file has database connection
- [ ] `npm start` shows all 4 services starting
- [ ] Backend shows "Application started" (after 60-90s)
- [ ] Frontend loads at http://localhost:5173
- [ ] Browser console shows `[getUser]` success logs
- [ ] Can see Login/Signup forms
- [ ] `check-health.bat` shows ✅ for all services

---

## 🆘 Emergency Restart

```bash
# Kill all Node and Java processes
taskkill /f /im node.exe
taskkill /f /im java.exe

# Start fresh
npm start
```

---

**Ready to go!** 🎉

Next steps:

1. Sign up for an account
2. Explore the dashboard
3. Check browser console for any errors
4. Report issues with console logs attached
