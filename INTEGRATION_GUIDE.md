# CryptoNex - Unified Integration Guide

## 🎯 Project Architecture

CryptoNex is now integrated as a **single localhost project** with three main components:

```
┌─────────────────────────────────────────────────┐
│               CRYPTONEX UNIFIED                  │
├──────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────────┐ │
│  │    FRONTEND (React + Vite)                 │ │
│  │    http://localhost:5173                   │ │
│  └────────────┬─────────────────────────────┘ │
│               │                                │
│               └─────────┬──────────────────┐   │
│                         │                  │   │
│  ┌──────────────────────▼──────────────────┐ │
│  │   API GATEWAY (Express Proxy)           │ │
│  │   http://localhost:3000                 │ │
│  │   - Routes /api to Backend              │ │
│  │   - Routes /chat to Crypto Bot          │ │
│  │   - Routes /usercoins to Crypto Bot     │ │
│  └──────┬────────────────────────┬────────┘ │
│         │                        │           │
│         ▼                        ▼           │
│  ┌──────────────────┐  ┌─────────────────┐ │
│  │ BACKEND          │  │ CRYPTO BOT      │ │
│  │ Spring Boot      │  │ Node.js Express │ │
│  │ Java/PostgreSQL  │  │ AI Integration  │ │
│  │ :1106            │  │ :5000           │ │
│  └──────────────────┘  └─────────────────┘ │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🚀 Running the Integrated Project

### Option 1: All Services with Docker Compose (Recommended)

```bash
# Install dependencies for API Gateway
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Run all services with Docker
docker-compose up --build

# Services will be available at:
# - Frontend:   http://localhost:5173
# - API Gateway: http://localhost:3000
# - Backend:    http://localhost:1106 (internal)
# - Crypto Bot: http://localhost:5000 (internal)
```

### Option 2: Local Development (Without Docker)

#### Terminal 1 - API Gateway

```bash
npm install
npm start
# Gateway runs on http://localhost:3000
```

#### Terminal 2 - Frontend

```bash
cd Cryptonex-Frontend-main
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

#### Terminal 3 - Crypto Bot

```bash
cd crypto_bot-main
npm install
npm start
# Bot runs on http://localhost:5000
```

#### Terminal 4 - Backend (requires Java 21)

```bash
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run
# Backend runs on http://localhost:1106
```

---

## 📡 API Routes & Request Flow

### Frontend Requests

```
Frontend (http://localhost:5173)
    ↓
Makes request to http://localhost:3000 (API Gateway)
    ↓
API Gateway routes based on path:
    - /api/* → Backend (http://localhost:1106)
    - /chat → Crypto Bot (http://localhost:5000)
    - /usercoins → Crypto Bot (http://localhost:5000)
    - /usercoinPortfolio → Crypto Bot (http://localhost:5000)
```

### Example API Calls

#### 1. Authentication (Backend)

```javascript
// Frontend → Gateway → Backend
POST http://localhost:3000/api/auth/login
```

#### 2. User Profile (Backend)

```javascript
POST http://localhost:3000/api/users/profile
```

#### 3. Chat with AI (Crypto Bot)

```javascript
POST http://localhost:3000/chat
Body: { userId, message }
```

#### 4. Create Coin (Crypto Bot + Backend)

```javascript
POST http://localhost:3000/usercoins/create
// Crypto Bot receives request and calls Backend for user verification
```

---

## 🔧 Configuration Files

### API Gateway (api-gateway.js)

- Routes all requests to appropriate services
- Handles CORS for cross-origin requests
- Logs all API calls for debugging
- Health check endpoint: `GET http://localhost:3000/health`

### Frontend (vite.config.js)

- Configured with API Gateway proxy
- Uses environment variable `VITE_API_BASE_URL`
- Automatically routes requests during development

### Crypto Bot

- Environment: `SPRING_BOOT_URL=http://localhost:3000`
- Calls Backend through API Gateway
- Maintains conversation memory per user
- Uses SQLite for local data

### Backend (application.properties)

- Runs on port 1106
- PostgreSQL database connection
- Email, Stripe, Razorpay configurations

---

## 📝 Environment Variables

Create `.env` file in root directory with:

```env
# API Gateway
PORT=3000
BACKEND_URL=http://localhost:1106
BOT_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173

# Frontend
VITE_API_BASE_URL=http://localhost:3000

# Crypto Bot
NODE_ENV=development
GEMINI_API_KEY=your_key
SPRING_BOOT_URL=http://localhost:3000

# Backend (from application.properties)
SPRING_DATASOURCE_URL=your_db_url
STRIPE_API_KEY=your_key
# ... other backend configs
```

---

## 🧪 Testing Integration

### Health Check

```bash
curl http://localhost:3000/health
```

Response:

```json
{
  "status": "ok",
  "message": "API Gateway is running",
  "services": {
    "backend": "http://localhost:1106",
    "bot": "http://localhost:5000",
    "frontend": "http://localhost:5173"
  }
}
```

### Test Frontend Connection

1. Open http://localhost:5173
2. Open browser DevTools → Console
3. Check Network tab for requests to http://localhost:3000

### Test Backend Connection

```bash
curl -X GET http://localhost:3000/api/health
```

### Test Crypto Bot

```bash
curl -X POST http://localhost:3000/chat \
  -H "Content-Type: application/json" \
  -d '{"userId":"test-user","message":"hello"}'
```

---

## 📊 Request Logging

API Gateway logs all requests in format:

```
[SERVICE] METHOD /path?query
```

Example logs:

```
[BACKEND] GET /api/users/profile?id=123
[BOT] POST /chat
[BOT] POST /usercoins/create
```

---

## 🐛 Troubleshooting

### "Cannot connect to Backend"

```bash
# Check if backend is running on port 1106
netstat -ano | findstr :1106

# Check backend logs for errors
cd Cryptonex-Backend-master
mvnw.cmd spring-boot:run
```

### "Cannot connect to Crypto Bot"

```bash
# Check if bot is running on port 5000
netstat -ano | findstr :5000

# Restart bot
cd crypto_bot-main
npm start
```

### "Frontend shows 'Cannot reach API'"

```bash
# Check API Gateway is running
netstat -ano | findstr :3000

# Check Vite proxy is configured in vite.config.js
# Check VITE_API_BASE_URL environment variable
```

### "CORS errors"

- API Gateway has CORS enabled for all origins
- Check browser console for specific error
- Verify API Gateway is receiving requests

---

## 📦 Docker Deployment

### Build All Services

```bash
docker-compose build
```

### Run with Docker

```bash
docker-compose up
```

### Stop Services

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f api-gateway
docker-compose logs -f frontend
docker-compose logs -f crypto-bot
docker-compose logs -f backend
```

---

## 🔄 Request Lifecycle

### Complete User Authentication Flow

```
1. User enters credentials in Frontend (port 5173)
   ↓
2. Frontend sends POST to http://localhost:3000/api/auth/login
   ↓
3. API Gateway receives request and forwards to Backend (port 1106)
   ↓
4. Backend validates credentials against PostgreSQL
   ↓
5. Backend returns JWT token
   ↓
6. API Gateway returns token to Frontend
   ↓
7. Frontend stores JWT in localStorage
   ↓
8. Subsequent requests include JWT in Authorization header
```

### Complete Chat with AI Flow

```
1. User sends message in Frontend UI
   ↓
2. Frontend sends POST to http://localhost:3000/chat with message
   ↓
3. API Gateway routes to Crypto Bot (port 5000)
   ↓
4. Crypto Bot receives request and calls Gemini AI
   ↓
5. Crypto Bot formats response and returns to Gateway
   ↓
6. API Gateway returns to Frontend
   ↓
7. Frontend displays AI response to user
```

---

## 📚 File Structure

```
CryptoNex-main/
├── api-gateway.js              ← Main API Gateway entry point
├── docker-compose.yml          ← Docker orchestration
├── Dockerfile.gateway          ← API Gateway Docker image
├── package.json                ← API Gateway dependencies
├── .env.example                ← Environment variables template
│
├── Cryptonex-Frontend-main/
│   ├── Dockerfile              ← Frontend Docker image
│   ├── vite.config.js          ← Updated with proxy config
│   └── src/Api/api.js          ← Updated to use API Gateway
│
├── crypto_bot-main/
│   ├── Dockerfile              ← Bot Docker image
│   ├── index.js                ← Main entry point
│   └── routes/
│       ├── chat.js             ← Updated with API Gateway URL
│       └── usercoins.js        ← Updated with API Gateway URL
│
└── Cryptonex-Backend-master/
    ├── Dockerfile              ← Backend Docker image (existing)
    └── pom.xml                 ← Java 21 configuration
```

---

## 🎓 Key Integration Points

| Component   | Connection              | Port        | Route                                 |
| ----------- | ----------------------- | ----------- | ------------------------------------- |
| Frontend    | → Gateway               | 5173        | Local dev / http://localhost:5173     |
| API Gateway | → Backend               | 3000 → 1106 | /api/\*                               |
| API Gateway | → Bot                   | 3000 → 5000 | /chat, /usercoins, /usercoinPortfolio |
| Crypto Bot  | → Backend               | 5000 → 1106 | /api/users/profile                    |
| Frontend    | ← Backend (via Gateway) | 3000        | All API responses                     |

---

## ✅ Verification Checklist

- [ ] API Gateway running on http://localhost:3000
- [ ] Frontend running on http://localhost:5173
- [ ] Crypto Bot running on http://localhost:5000
- [ ] Backend running on http://localhost:1106
- [ ] Health check passes: `curl http://localhost:3000/health`
- [ ] Frontend can load without API errors
- [ ] Can login/register through frontend
- [ ] Chat AI responds to messages
- [ ] User profile loads correctly

---

## 🚀 Production Deployment

For production, update API Gateway URLs to match deployed services:

```env
# Production
BACKEND_URL=https://your-backend-domain.com
BOT_URL=https://your-bot-domain.com
FRONTEND_URL=https://your-frontend-domain.com
```

Then rebuild Docker images with production URLs.

---

**Last Updated**: June 1, 2026
**Status**: ✅ Fully Integrated & Ready for Development
**Next Steps**: Configure environment variables and run `docker-compose up`
