# CryptoNex Project Setup & Execution Guide

## Overview

Your CryptoNex project consists of three main components:

### 1. **Frontend** (React + Vite)

- **Location**: `Cryptonex-Frontend-main/`
- **Port**: 5173 (default Vite dev server)
- **Tech**: React, Redux, Radix UI, TailwindCSS
- **Status**: ✅ Ready to run

### 2. **Crypto Bot** (Node.js + Express)

- **Location**: `crypto_bot-main/`
- **Port**: 5000 (configurable in .env)
- **Tech**: Node.js, Express, SQLite, Google Generative AI, OpenAI
- **Status**: ✅ Ready to run

### 3. **Backend** (Java + Spring Boot)

- **Location**: `Cryptonex-Backend-master/`
- **Port**: 8080 (default Spring Boot)
- **Tech**: Spring Boot 3.2.4, MySQL/PostgreSQL, JWT, Spring Security
- **Java Version Updated**: Java 21 LTS ✅
- **Status**: ⏳ Requires Java 21 installation

---

## Prerequisites

### For All Projects

- Node.js 18+ (already have npm packages installed ✅)
- Git (for version control)

### For Java Backend

- **Java 21 LTS** - NOT YET INSTALLED ❌
  - Download from: https://www.oracle.com/java/technologies/downloads/
  - Or use OpenJDK from: https://adoptium.net/

---

## How to Run All Projects

### Option 1: Run Script (Automated - Once Java is installed)

```powershell
cd C:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main
.\run-all-projects.ps1
```

### Option 2: Manual - Run Each in Separate Terminal

#### Terminal 1 - Frontend

```powershell
cd C:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Frontend-main
npm run dev
```

**Access**: http://localhost:5173

#### Terminal 2 - Crypto Bot

```powershell
cd C:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\crypto_bot-main
npm start
```

**Access**: http://localhost:5000

#### Terminal 3 - Backend (After Java 21 Installation)

```powershell
cd C:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main\Cryptonex-Backend-master
mvnw.cmd spring-boot:run
```

**Access**: http://localhost:8080

---

## Java 21 Installation Steps

### Method 1: Oracle JDK 21 (Official)

1. Go to: https://www.oracle.com/java/technologies/downloads/
2. Download: **Java 21 LTS** for Windows
3. Run installer and follow setup wizard
4. Verify installation:
   ```
   java -version
   ```

### Method 2: Eclipse Temurin (OpenJDK)

1. Go to: https://adoptium.net/
2. Download: **Java 21 LTS** for Windows
3. Install and add to PATH if needed

### Method 3: Using Windows Package Manager (winget)

```powershell
winget install Oracle.JDK.21
```

---

## Troubleshooting

### ❌ "Java command not found"

- Verify Java is installed: `java -version`
- Add Java to system PATH if needed
- Restart terminal after installation

### ❌ Maven wrapper fails

- Run from PowerShell (not cmd)
- Ensure Java 21 is set as JAVA_HOME
- Try: `.\mvnw.cmd clean install` first

### ❌ Port already in use

- Frontend: Change port in `vite.config.js`
- Crypto Bot: Update in `index.js` or `.env`
- Backend: Change in `application.properties`

### ❌ NPM Dependencies errors

- Run: `npm audit fix` in each project
- Delete `node_modules` and `package-lock.json`
- Re-run: `npm install`

---

## Project Configuration Files

### Frontend Environment

- **Config File**: `vite.config.js`
- **API Endpoint**: Check `src/Api/api.js`

### Crypto Bot Configuration

- **Config File**: `.env` (create if doesn't exist)
- **Main File**: `index.js`

### Backend Configuration

- **Config File**: `src/main/resources/application.properties`
- **Database**: Configure MySQL/PostgreSQL connection

---

## Key Updates Made

✅ **Java Version Updated in pom.xml**

- `java.version`: 17 → **21**
- `maven.compiler.source`: 19 → **21**
- `maven.compiler.target`: 19 → **21**

✅ **Dependencies Installed**

- Frontend: 529 packages installed
- Crypto Bot: 256 packages installed

---

## Accessing Your Services

Once all are running:

| Service    | URL                   | Purpose         |
| ---------- | --------------------- | --------------- |
| Frontend   | http://localhost:5173 | Web UI          |
| Crypto Bot | http://localhost:5000 | AI Bot API      |
| Backend    | http://localhost:8080 | REST API (Java) |

---

## Next Steps

1. **Install Java 21 LTS** (Critical for backend)
2. **Set JAVA_HOME** environment variable
3. **Test Maven**: `mvnw.cmd --version`
4. **Start all services** using the run script or manual terminals
5. **Test connectivity** between services

---

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Review individual project README files
3. Check application logs in each terminal
4. Verify all ports are available

---

**Last Updated**: May 31, 2026
**Java Version**: 21 LTS (Configured ✅)
**Status**: Ready for deployment (pending Java installation)
