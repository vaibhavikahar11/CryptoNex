# 🚀 Quick Reference - CryptoNex Project

## Current Status: 2/3 Services Running ✅

```
┌─────────────────────────────────────────────────────────────┐
│                    CRYPTONEX STACK                          │
├─────────────────────────────────────────────────────────────┤
│ Frontend (React)      → http://localhost:5173  ✅ RUNNING   │
│ Crypto Bot (Node)     → http://localhost:5000  ✅ RUNNING   │
│ Backend (Java/Boot)   → http://localhost:8080  ⏳ PENDING   │
└─────────────────────────────────────────────────────────────┘
```

---

## What Was Done

✅ **Java Version Upgraded in pom.xml**
- Updated from Java 17 → Java 21 LTS
- Maven compiler: 19 → 21
- All configuration synchronized

✅ **Dependencies Installed**
- Frontend: 529 packages
- Crypto Bot: 256 packages
- Ready for development

✅ **Services Started**
- Frontend running with Vite dev server
- Crypto Bot running with SQLite database connected
- All Node processes active

---

## What You Need to Do Next

### 🔴 CRITICAL: Install Java 21

Choose your method:

#### Quick Install (Command Line)
```powershell
# Windows 11+ with winget
winget install Oracle.JDK.21

# Or download manually from:
# https://www.oracle.com/java/technologies/downloads/
```

#### After Installation
```powershell
# Verify Java is installed
java -version

# Restart PowerShell/Terminal

# Navigate to backend
cd Cryptonex-Backend-master

# Start backend
mvnw.cmd spring-boot:run
```

---

## Quick Start Commands

### Terminal 1: Frontend
```powershell
cd Cryptonex-Frontend-main
npm run dev
```

### Terminal 2: Crypto Bot
```powershell
cd crypto_bot-main
npm start
```

### Terminal 3: Backend (After Java 21 Installation)
```powershell
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run
```

---

## Access Your Services

| Service  | URL                | What It Does |
|----------|-------------------|--------------|
| Frontend | http://localhost:5173 | Web UI / React App |
| Bot API  | http://localhost:5000 | AI Bot / REST API |
| Backend  | http://localhost:8080 | Java API / Database |

---

## Key Files Created

📄 **SETUP_GUIDE.md** - Complete setup instructions
📄 **PROJECT_STATUS.md** - Detailed current status
📄 **run-all-projects.ps1** - Automation script
📄 **pom.xml** - Updated with Java 21 ✅

---

## Troubleshooting Quick Fixes

| Issue | Fix |
|-------|-----|
| "Java not found" | Install Java 21 + restart terminal |
| "Port already in use" | Run: `netstat -ano \| findstr :PORT` |
| Frontend not loading | Try: `npm run dev` with `--host` flag |
| Bot not connecting to DB | Check `uploads/` folder permissions |
| Maven wrapper fails | Run from PowerShell (not cmd) |

---

## ⏱️ Time to Full System

- Java installation: **~10 minutes**
- Backend startup: **~30 seconds**
- **Total**: **~11 minutes to full operational stack**

---

## 📞 Your Project Structure

```
CryptoNex-main/
├── Cryptonex-Frontend-main/   (React + Redux + TailwindCSS) ✅
├── crypto_bot-main/            (Node + Express + SQLite) ✅
├── Cryptonex-Backend-master/   (Spring Boot + MySQL/PG) ⏳
├── SETUP_GUIDE.md              (Full instructions)
├── PROJECT_STATUS.md           (Current status)
└── run-all-projects.ps1        (Start all services)
```

---

## Remember

✨ **Your earlier changes are preserved** - nothing was lost during the upgrade process

🎯 **All that's needed**: Install Java 21, restart terminal, run the backend

🚀 **You're almost there!** Just one more step to a fully operational CryptoNex platform

---

**Updated**: May 31, 2026
**Status**: 2 of 3 services operational
**Next**: Install Java 21 LTS
