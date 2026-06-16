# 🚀 CryptoNex - Quick Start (Unified Integration)

## ⚡ 5-Minute Setup

### **Prerequisites**

- Node.js 18+ installed
- Java 21 JDK installed (for backend)
- Port 3000, 5000, 5173, 1106 available

### **Step 1: Start API Gateway (Port 3000)**

```bash
# In CryptoNex-main directory
npm start

# Expected output:
# ✅ API Gateway running on http://localhost:3000
# 📊 Health check: http://localhost:3000/health
```

### **Step 2: Start Frontend (Port 5173)**

```bash
# In new terminal, in Cryptonex-Frontend-main directory
npm install  # (if dependencies not installed)
npm run dev

# Expected output:
# ➜  Local:   http://localhost:5173/
```

### **Step 3: Start Crypto Bot (Port 5000)**

```bash
# In new terminal, in crypto_bot-main directory
npm install  # (if dependencies not installed)
npm start

# Bot will connect to API Gateway automatically
```

### **Step 4: Start Backend (Port 1106)**

```bash
# In new terminal, in Cryptonex-Backend-master directory
mvnw.cmd spring-boot:run

# Backend will start on port 1106
```

### **Step 5: Verify Everything Works**

```bash
# Test API Gateway health check
curl http://localhost:3000/health

# Open browser
# http://localhost:5173
```

---

## 🔍 Checking Service Status

| Service     | Port | Check Command                   | Status                      |
| ----------- | ---- | ------------------------------- | --------------------------- |
| API Gateway | 3000 | `netstat -ano \| findstr :3000` | Should show running         |
| Frontend    | 5173 | `netstat -ano \| findstr :5173` | Should show Vite dev server |
| Crypto Bot  | 5000 | `netstat -ano \| findstr :5000` | Should show Node.js         |
| Backend     | 1106 | `netstat -ano \| findstr :1106` | Should show Java            |

---

## 📱 Using the Application

1. **Open Frontend**: http://localhost:5173
2. **Login/Register** (credentials stored in PostgreSQL via Backend)
3. **Chat with AI** (uses Crypto Bot → Gemini AI)
4. **View Wallet** (retrieves data from Backend)
5. **Create/Trade Coins** (Crypto Bot + Backend)

---

## 🐛 Quick Troubleshooting

### "API Gateway won't start"

```bash
# Port 3000 already in use?
netstat -ano | findstr :3000

# Kill process or use different port
$env:PORT=3001; npm start
```

### "Frontend shows blank page"

```bash
# Check browser console (F12)
# Look for API errors (should show requests to :3000)
# Verify API Gateway is running
curl http://localhost:3000/health
```

### "Can't login"

```bash
# Check if Backend is running on :1106
# Check PostgreSQL connection in application.properties
# Check .env database credentials
```

### "Chat not working"

```bash
# Check if Crypto Bot is running on :5000
# Check GEMINI_API_KEY in .env is set
# Check browser console for errors
```

---

## 📊 Architecture Reminder

```
http://localhost:5173 (Frontend)
         ↓
http://localhost:3000 (API Gateway) ← central hub
         ↙                    ↘
:5000 (Bot)              :1106 (Backend)
```

All frontend requests go through the gateway!

---

## 🔧 Configuration

If you need to change service URLs, edit `.env`:

```env
PORT=3000
BACKEND_URL=http://localhost:1106
BOT_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

---

## 💡 Pro Tips

1. **Keep terminals organized**: Use VS Code terminal or tmux
2. **Monitor logs**: Watch terminal output for errors
3. **Test in incognito**: Avoid browser cache issues
4. **Check DevTools**: Network tab shows actual API calls
5. **Save credentials**: Auth tokens stored in localStorage

---

## ✅ Verification Checklist

```
☐ API Gateway running on :3000
☐ Frontend running on :5173
☐ Crypto Bot running on :5000
☐ Backend running on :1106
☐ Can access http://localhost:5173
☐ Network tab shows requests to :3000
☐ Health check: curl http://localhost:3000/health
☐ Can login/register
☐ Chat works
```

---

## 🆘 Getting Help

1. **Check logs** in terminal windows
2. **Review** [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for detailed info
3. **Test health endpoint**: `curl http://localhost:3000/health`
4. **Look at network tab** in browser DevTools (F12 → Network)

---

**You're all set! Enjoy developing CryptoNex! 🎉**

See [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) for more details.
