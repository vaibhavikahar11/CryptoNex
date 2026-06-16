@echo off
REM ============================================
REM CryptoNex Health Check Script
REM Verifies all services are running properly
REM ============================================

echo.
echo [TEST] CryptoNex Service Health Check
echo ============================================
echo.

REM Test 1: API Gateway
echo [TEST 1] Checking API Gateway (Port 3000)...
timeout /t 1 /nobreak > nul
curl -s http://localhost:3000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [✅] API Gateway is running
    curl -s http://localhost:3000/health | find "status" > nul 2>&1
    if %errorlevel% equ 0 (
        echo     └─ Status: OK
    )
) else (
    echo [❌] API Gateway is NOT running (unreachable on port 3000)
)
echo.

REM Test 2: Frontend
echo [TEST 2] Checking Frontend (Port 5173)...
timeout /t 1 /nobreak > nul
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [✅] Frontend is running
) else (
    echo [❌] Frontend is NOT running (unreachable on port 5173)
)
echo.

REM Test 3: Crypto Bot
echo [TEST 3] Checking Crypto Bot (Port 5000)...
timeout /t 1 /nobreak > nul
curl -s http://localhost:5000 >nul 2>&1
if %errorlevel% equ 0 (
    echo [✅] Crypto Bot is running
) else (
    echo [❌] Crypto Bot is NOT running (unreachable on port 5000)
)
echo.

REM Test 4: Backend (Spring Boot)
echo [TEST 4] Checking Backend (Port 1106)...
timeout /t 1 /nobreak > nul
curl -s http://localhost:1106/health >nul 2>&1
if %errorlevel% equ 0 (
    echo [✅] Backend is running
) else (
    echo [❌] Backend is NOT running (unreachable on port 1106)
    echo     Note: Backend takes 30-90 seconds to start on first run
)
echo.

REM Summary
echo ============================================
echo [SUMMARY] Service Status Check Complete
echo ============================================
echo.
echo 📍 Access the app at: http://localhost:5173
echo 📊 Gateway health at: http://localhost:3000/health
echo.
echo If services are not running:
echo   1. Make sure "npm start" is running in terminal
echo   2. Wait 90 seconds for first-time backend startup
echo   3. Check terminal output for error messages
echo.
pause
