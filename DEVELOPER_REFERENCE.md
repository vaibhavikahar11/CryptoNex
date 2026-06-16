# 🎯 CryptoNex Developer Reference Card

**Print this or bookmark it for quick reference!**

---

## 🚀 Start Services (5 Commands)

```bash
# Terminal 1 - API Gateway (localhost:3000)
npm start

# Terminal 2 - Frontend (localhost:5173)
cd Cryptonex-Frontend-main && npm run dev

# Terminal 3 - Crypto Bot (localhost:5000)
cd crypto_bot-main && npm start

# Terminal 4 - Backend (localhost:1106)
cd Cryptonex-Backend-master && mvnw.cmd spring-boot:run

# Terminal 5 - Open Browser
# http://localhost:5173
```

---

## 🌐 Access URLs

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | User interface |
| **API Gateway** | http://localhost:3000 | Request proxy |
| **Health Check** | http://localhost:3000/health | Gateway status |

---

## 🔌 API Routes Through Gateway

```
/api/*                    → Backend (Spring Boot, :1106)
/chat                     → Crypto Bot (Node.js, :5000)
/usercoins                → Crypto Bot (Node.js, :5000)
/usercoinPortfolio        → Crypto Bot (Node.js, :5000)
/health                   → Gateway status
```

---

## 📊 Service Status Checks

```bash
# Check all ports in use
netstat -ano | findstr :3000   # API Gateway
netstat -ano | findstr :5000   # Crypto Bot
netstat -ano | findstr :5173   # Frontend
netstat -ano | findstr :1106   # Backend
```

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port already in use | `netstat -ano \| findstr :PORT` to find PID, kill process |
| API Gateway won't start | Ensure dependencies: `npm install` |
| Frontend can't reach API | Check API Gateway is running on :3000 |
| Bot/Backend unavailable | Check services are running on correct ports |
| CORS errors | API Gateway has CORS enabled, check other issues |
| Database connection failed | Verify PostgreSQL credentials in `.env` |

---

## 📁 Important Files

| File | Purpose | Edit For |
|------|---------|----------|
| `api-gateway.js` | Request proxy | Adding routes, changing proxy rules |
| `.env` | Configuration | API keys, URLs, credentials |
| `vite.config.js` | Frontend config | Frontend dev settings |
| `package.json` (root) | Gateway deps | Adding npm packages |
| `pom.xml` | Backend config | Java dependencies |

---

## 🔧 Common Commands

```bash
# Install dependencies
npm install                          # Root (gateway)
cd Cryptonex-Frontend-main && npm install
cd crypto_bot-main && npm install
cd Cryptonex-Backend-master && mvnw.cmd clean install

# Run with npm
npm start                            # API Gateway
npm run dev                          # API Gateway with nodemon

# Run with Maven (Backend)
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run             # Start backend

# Docker
docker-compose up --build            # Build and start all services
docker-compose down                  # Stop all services
docker-compose logs -f api-gateway   # View gateway logs

# Git
git status                           # Check changes
git add .                            # Stage all
git commit -m "message"              # Commit
git push origin modernize/java-*     # Push to branch
```

---

## 📝 Environment Variables (.env)

```env
# API Gateway
PORT=3000
BACKEND_URL=http://localhost:1106
BOT_URL=http://localhost:5000

# Frontend
VITE_API_BASE_URL=http://localhost:3000

# Crypto Bot
SPRING_BOOT_URL=http://localhost:3000
GEMINI_API_KEY=your_key_here

# Backend (PostgreSQL)
SPRING_DATASOURCE_URL=your_db_url
SPRING_DATASOURCE_USERNAME=your_username
```

---

## 🧪 Testing API Calls

```bash
# Health check
curl http://localhost:3000/health

# Test backend route through gateway
curl -X GET "http://localhost:3000/api/users/profile" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test bot route through gateway
curl -X POST "http://localhost:3000/chat" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user123","message":"hello"}'
```

---

## 🔍 Browser DevTools Tips

1. **Network Tab**
   - Look for requests to http://localhost:3000
   - Check request/response headers
   - Verify Authorization token

2. **Console Tab**
   - Check for API errors
   - Look for CORS warnings
   - Verify API responses

3. **Application Tab**
   - Check localStorage for JWT token
   - Verify cookies
   - Check session storage

---

## 📈 File Sizes & Dependencies

| Component | Type | Packages | Size |
|-----------|------|----------|------|
| API Gateway | Node.js | 109 | 50MB (node_modules) |
| Frontend | React | 529 | 400MB+ (node_modules) |
| Crypto Bot | Node.js | 256 | 200MB+ (node_modules) |
| Backend | Java | Maven | 500MB+ (classes) |

---

## 🚀 Docker Quick Reference

```bash
# Build specific service
docker-compose build api-gateway
docker-compose build frontend
docker-compose build crypto-bot
docker-compose build backend

# Run all services
docker-compose up

# Run in background
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs api-gateway
docker-compose logs -f --tail=100 frontend

# Rebuild everything
docker-compose down && docker-compose up --build
```

---

## 🎓 Architecture Summary

```
User Browser
    ↓
http://localhost:5173 (Frontend React)
    ↓ (all API calls to)
http://localhost:3000 (API Gateway) ← SINGLE ENTRY POINT
    ↙                      ↘
:5000 (Crypto Bot)    :1106 (Spring Backend)
    ↓ (calls)
:1106 (Backend for auth)
```

---

## 📚 Documentation Links

- **[INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)** - Complete setup guide
- **[INTEGRATION_SUMMARY.md](INTEGRATION_SUMMARY.md)** - Project summary
- **[QUICK_START_INTEGRATION.md](QUICK_START_INTEGRATION.md)** - 5-minute setup
- **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** - Status report

---

## 🔑 Default Ports

```
3000  ← API Gateway (USE THIS)
5000  ← Crypto Bot (internal)
5173  ← Frontend (USE THIS)
1106  ← Backend (internal)
```

---

## ✅ Before You Start

- [ ] Node.js 18+ installed
- [ ] Java 21 JDK installed
- [ ] Ports 3000, 5000, 5173, 1106 available
- [ ] PostgreSQL accessible (for backend)
- [ ] API keys in `.env` file

---

## 🚨 Common Errors & Solutions

```javascript
// Error: Cannot GET /
// Solution: Run API Gateway (npm start)

// Error: Cannot reach API
// Solution: Check gateway on localhost:3000

// Error: Port already in use
// Solution: Kill process or use different port

// Error: Module not found
// Solution: Run npm install in that directory

// Error: Database connection failed
// Solution: Check .env credentials and PostgreSQL running
```

---

## 💡 Pro Tips

1. **Use VS Code's multi-terminal** for organized workspace
2. **Set up aliases** for frequent commands
3. **Monitor logs carefully** - they show the issue
4. **Test in incognito mode** to avoid cache issues
5. **Use Postman** for complex API testing
6. **Keep terminals open** to see real-time errors
7. **Commit frequently** to save progress

---

## 🎯 Common Workflows

### Local Development
```bash
1. npm start                                (Terminal 1)
2. cd Cryptonex-Frontend-main && npm run dev (Terminal 2)
3. cd crypto_bot-main && npm start          (Terminal 3)
4. cd Cryptonex-Backend-master && mvnw spring-boot:run (Terminal 4)
5. Open http://localhost:5173 in browser
6. Test features and check Network tab
```

### Deploy with Docker
```bash
1. docker-compose up --build
2. Wait for all services to start
3. Open http://localhost:5173
4. All services communicate via internal network
```

### Debug API Issue
```bash
1. Open http://localhost:5173 in browser
2. Press F12 (DevTools)
3. Go to Network tab
4. Look for failed requests (red ones)
5. Click request to see details
6. Check curl command at bottom for exact call
7. Run in terminal: curl <command> to test
```

---

**Bookmark this page or keep it open while developing!**

Last Updated: June 1, 2026
