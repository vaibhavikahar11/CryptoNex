# 🚀 IMMEDIATE ACTION GUIDE - Get Frontend Working NOW

## ⏱️ 2-Minute Fix

### **You Need 2 Terminal Windows Open**

---

## **TERMINAL 1: Start API Gateway**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main
node api-gateway.js
```

**Wait for this message:**

```
✅ API Gateway running on http://localhost:3000
```

**✅ Leave this terminal open**

---

## **TERMINAL 2: Start Frontend**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Frontend-main
npm run dev
```

**Wait for this message:**

```
VITE v5.4.11  ready in XXX ms
➜  Local:   http://localhost:5173/
```

**✅ Leave this terminal open**

---

## **NOW OPEN BROWSER**

```
http://localhost:5173
```

### **You should see:**

1. **Loading screen** with spinner (2-5 seconds)
2. **Then either:**
   - Login/Signup forms (if no token)
   - Dashboard (if you have valid token)

---

## **Optional: TERMINAL 3 (If you want Backend)**

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Backend-master
mvnw.cmd spring-boot:run
```

**⏳ Wait 30-90 seconds (first time only)**

**Look for:**

```
Started CryptoNexApplication in XX seconds
```

---

## ✅ Complete Setup (One Command - All Services)

If you want everything in one terminal:

```bash
cd c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main
npm start
```

This launches:

- ✅ API Gateway (port 3000)
- ✅ Frontend (port 5173)
- ✅ Bot (port 5000)
- ✅ Backend (port 1106)

**But watch for startup messages - might take 90+ seconds on first run**

---

## 🎯 What To Do If Still Stuck

### **Browser still shows "Can't reach"?**

**Step 1: Check if services are running**

```bash
netstat -ano | findstr "5173"  # Frontend
netstat -ano | findstr "3000"  # Gateway
```

If no output → services not running → try again from above

### **Step 2: Try clearing browser cache**

- Press: `Ctrl + Shift + Delete`
- Select "All time"
- Clear cache and cookies
- Refresh: `Ctrl + F5`

### **Step 3: Try different browser**

- Chrome/Edge/Firefox
- Sometimes browser cache is persistent

### **Step 4: Port conflict?**

```bash
netstat -ano | findstr "5173"
```

If something else is using port 5173:

```bash
taskkill /f /pid <PID_NUMBER>
npm run dev  # Try again
```

---

## 🆘 Emergency Reset

**If nothing works - kill everything and restart:**

```bash
taskkill /f /im node.exe
taskkill /f /im java.exe
```

Then start again:

**Terminal 1:**

```bash
node api-gateway.js
```

**Terminal 2:**

```bash
npm run dev
```

Open: http://localhost:5173

---

## 🎨 Expected Screen Flow

```
1. Browser shows:
   ┌─────────────────────────┐
   │    🔄 Initializing...   │
   │                         │
   │  (loading spinner)      │
   └─────────────────────────┘

2. After 2-5 seconds → Becomes:
   ┌─────────────────────────┐
   │    LOGIN / SIGNUP       │
   │                         │
   │  [Email field]          │
   │  [Password field]       │
   │  [Login button]         │
   └─────────────────────────┘

3. After login → Dashboard:
   ┌─────────────────────────┐
   │  CryptoNex Dashboard    │
   │                         │
   │  Portfolio | Wallet     │
   │  Market | Activity      │
   └─────────────────────────┘
```

---

## 📱 URLs You Need

| Service      | URL                   | Terminal  |
| ------------ | --------------------- | --------- |
| **Frontend** | http://localhost:5173 | Browser   |
| **Gateway**  | http://localhost:3000 | Info only |
| **Backend**  | http://localhost:1106 | Backend   |
| **Bot**      | http://localhost:5000 | Bot       |

---

## ✨ Console Messages to Expect

When you open browser DevTools (F12 → Console):

```javascript
// ✅ Good messages:
[getUser] Fetching user profile from http://localhost:3000/api/users/profile
[getUser] ✅ User loaded successfully: {user: {...}}

// ⚠️ Okay if no token:
[getUser] ❌ Error fetching user: undefined
// (This just means no JWT token - shows login form)

// ❌ Bad messages:
CORS error
Network failed
API unreachable
// (Check that Gateway is running on port 3000)
```

---

## ⏱️ Timing

| Event              | Time           | Action                |
| ------------------ | -------------- | --------------------- |
| Start Gateway      | Immediate      | ✅ Ready              |
| Start Frontend     | 1-2 sec        | ✅ Ready              |
| Browser loads      | 0.5 sec        | Shows spinner         |
| Redux fetches user | 2-5 sec        | Shows Login/Dashboard |
| **Total**          | **~5 seconds** | **🎉 App working**    |

---

## 💡 Pro Tips

1. **Keep terminals visible** - Monitor for error messages
2. **Use multiple monitors** - One for terminals, one for browser
3. **Check console first** - F12 shows most issues
4. **Port conflicts** - Use `netstat -ano | findstr` to check
5. **Restart is always safe** - `taskkill /f /im node.exe` won't hurt

---

## 🎯 Success = You See This

✅ http://localhost:5173 loads  
✅ Loading spinner shows  
✅ After 5 seconds → Form or Dashboard  
✅ No red errors in F12 console  
✅ Gateway health endpoint works: http://localhost:3000/health

---

**Status**: Ready to go! Follow steps 1-2 above, then open browser. 🚀

Last updated: 2026-06-02
