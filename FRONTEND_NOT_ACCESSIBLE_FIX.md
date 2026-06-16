# 🔧 Fix: "Site Can't Be Reached" on localhost:5173

## ❌ Problem

When opening `http://localhost:5173/`, browser shows:

```
This site can't be reached
localhost refused to connect
```

## ✅ Root Cause

**Frontend dev server (Vite) was NOT running!**

The `npm start` command should launch it automatically, but if it didn't:

- Node processes weren't spawned
- start.js may have failed silently
- Frontend service crashed during startup

## 🛠️ Solution

### **Option 1: Manual Start (Recommended)**

**Terminal 1 - Start API Gateway:**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main
node api-gateway.js
```

Expected output:

```
✅ API Gateway running on http://localhost:3000
```

**Terminal 2 - Start Frontend:**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Frontend-main
npm run dev
```

Expected output:

```
VITE v5.x.x  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**Terminal 3 - Start Backend (optional):**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Backend-master
mvnw.cmd spring-boot:run
```

### **Option 2: Using start.js (Orchestrator)**

**Single Terminal:**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main
npm start
```

Expected output:

```
✅ API Gateway running on http://localhost:3000
✅ Frontend React dev server ready at http://localhost:5173
✅ Crypto Bot listening on port 5000
✅ Spring Boot Application started (⏳ takes 30-90s first time)
```

---

## ✅ Verification

### **Check if Frontend is Running:**

1. Open Terminal and run:

```bash
netstat -ano | findstr 5173
```

If running, you'll see:

```
TCP    127.0.0.1:5173    0.0.0.0:0    LISTENING    12345
```

### **Check if Gateway is Running:**

```bash
netstat -ano | findstr 3000
```

### **Test in Browser:**

- Open: http://localhost:5173
- Should see: "CryptoNex - Initializing application..." loading screen
- Then: Login/Signup forms or Dashboard

---

## 🚨 Troubleshooting

### **If frontend still won't start:**

1. **Check if port 5173 is already in use:**

```bash
netstat -ano | findstr 5173
taskkill /f /pid <PID>
```

2. **Check for errors in frontend:**

```bash
cd Cryptonex-Frontend-main
npm run dev
```

Look for error messages like:

- `Module not found` → Run `npm install` in frontend folder
- `Port 5173 already in use` → Kill the process or change port

3. **Verify Node.js is installed:**

```bash
node -v
npm -v
```

4. **Clear npm cache and reinstall:**

```bash
cd Cryptonex-Frontend-main
rm node_modules
npm install
npm run dev
```

### **If Gateway won't start:**

1. **Check if port 3000 is in use:**

```bash
netstat -ano | findstr 3000
taskkill /f /pid <PID>
```

2. **Check Node.js can run:**

```bash
node api-gateway.js
```

### **If both are running but still can't reach http://localhost:5173:**

1. **Firewall might be blocking:**
   - Add exception for Node.js in Windows Firewall
   - Or disable temporarily to test

2. **Check localhost resolution:**

```bash
ping localhost
```

3. **Try IP address instead:**

```
http://127.0.0.1:5173
```

4. **Browser cache issue:**
   - Press `Ctrl+Shift+Delete` to clear cache
   - Or try in Incognito/Private mode

---

## 📋 Full Service Status Check

Run this to verify all services:

**Windows CMD/PowerShell:**

```bash
check-health.bat
```

**Or manually:**

```bash
# Check Frontend
curl http://localhost:5173

# Check Gateway
curl http://localhost:3000/health

# Check Bot
curl http://localhost:5000

# Check Backend
curl http://localhost:1106/health
```

---

## 🎯 Expected Behavior After Fix

| Step                       | Expected Result                        |
| -------------------------- | -------------------------------------- |
| Open http://localhost:5173 | Loading screen appears                 |
| Wait 2-5 seconds           | Screen changes to Login/Dashboard      |
| No JWT token               | Shows Login/Signup forms               |
| With JWT token             | Shows Dashboard with portfolio         |
| Open DevTools (F12)        | Console shows `[getUser]` success logs |

---

## 📝 Summary

**Problem**: Frontend not accessible  
**Cause**: Vite dev server not running  
**Fix**: Start `npm run dev` in frontend folder  
**Status**: ✅ FIXED - Frontend now on http://localhost:5173

---

**Document Created**: 2026-06-02  
**Status**: ✅ Solution Verified
