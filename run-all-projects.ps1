# CryptoNex Full Stack Runner
# This script starts all three projects: Frontend, Backend, and Crypto Bot

Write-Host "=====================================`n" -ForegroundColor Cyan
Write-Host "CryptoNex Full Stack Startup Script" -ForegroundColor Yellow
Write-Host "=====================================`n" -ForegroundColor Cyan

# Define project paths
$workspaceRoot = "c:\Users\Vaibhavi Kahar\OneDrive\Desktop\certification\CryptoNex-main"
$frontendPath = "$workspaceRoot\Cryptonex-Frontend-main"
$backendPath = "$workspaceRoot\Cryptonex-Backend-master"
$cryptoBotPath = "$workspaceRoot\crypto_bot-main"

# Colors for output
$infoColor = "Cyan"
$successColor = "Green"
$errorColor = "Red"
$warningColor = "Yellow"

# Function to start a project in a new terminal
function Start-Project {
    param(
        [string]$projectName,
        [string]$projectPath,
        [string]$startCommand
    )
    
    Write-Host "► Starting $projectName..." -ForegroundColor $infoColor
    Write-Host "  Path: $projectPath" -ForegroundColor $infoColor
    Write-Host "  Command: $startCommand" -ForegroundColor $infoColor
    
    # Start process in background
    $process = Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectPath'; $startCommand" -PassThru
    
    if ($process.Id) {
        Write-Host "✓ $projectName started (PID: $($process.Id))" -ForegroundColor $successColor
        return $process.Id
    } else {
        Write-Host "✗ Failed to start $projectName" -ForegroundColor $errorColor
        return $null
    }
}

# Startup sequence
Write-Host "STARTUP SEQUENCE`n" -ForegroundColor $warningColor

# 1. Start Frontend (React/Vite)
Write-Host "`n[1/3] Frontend (React + Vite) - Port 5173" -ForegroundColor $warningColor
if (Test-Path "$frontendPath\package.json") {
    $frontendPID = Start-Project "Cryptonex Frontend" $frontendPath "npm run dev"
} else {
    Write-Host "✗ Frontend project not found" -ForegroundColor $errorColor
}

Start-Sleep -Seconds 3

# 2. Start Crypto Bot (Node.js)
Write-Host "`n[2/3] Crypto Bot (Node.js + Express) - Port 5000" -ForegroundColor $warningColor
if (Test-Path "$cryptoBotPath\package.json") {
    $botPID = Start-Project "Crypto Bot" $cryptoBotPath "npm start"
} else {
    Write-Host "✗ Crypto Bot project not found" -ForegroundColor $errorColor
}

Start-Sleep -Seconds 3

# 3. Start Backend (Java/Spring Boot)
Write-Host "`n[3/3] Backend (Spring Boot) - Port 8080" -ForegroundColor $warningColor
if (Test-Path "$backendPath\pom.xml") {
    Write-Host "⚠ Backend requires Java to be installed" -ForegroundColor $warningColor
    Write-Host "  Current Status: Please install Java 21 LTS" -ForegroundColor $warningColor
    Write-Host "  Once Java is installed, run: mvnw.cmd spring-boot:run" -ForegroundColor $infoColor
} else {
    Write-Host "✗ Backend project not found" -ForegroundColor $errorColor
}

# Summary
Write-Host "`n=====================================`n" -ForegroundColor Cyan
Write-Host "RUNNING SERVICES`n" -ForegroundColor $successColor
Write-Host "  ✓ Frontend:   http://localhost:5173" -ForegroundColor $successColor
Write-Host "  ✓ Crypto Bot: http://localhost:5000" -ForegroundColor $successColor
Write-Host "  ⏳ Backend:   http://localhost:8080 (pending Java installation)" -ForegroundColor $warningColor
Write-Host "`n" -ForegroundColor Cyan

Write-Host "NEXT STEPS:`n" -ForegroundColor $infoColor
Write-Host "1. Install Java 21 LTS" -ForegroundColor $infoColor
Write-Host "2. Update pom.xml to use Java 21" -ForegroundColor $infoColor
Write-Host "3. Run backend in another terminal with: mvnw.cmd spring-boot:run" -ForegroundColor $infoColor
Write-Host "`n=====================================`n" -ForegroundColor Cyan

Write-Host "Press Ctrl+C in any terminal to stop a service" -ForegroundColor $warningColor
