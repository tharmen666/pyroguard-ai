@echo off
title PyroGuard AI - Standalone Autonomous Fire Compliance Engine
color 0b
echo ========================================================
echo   PYROGUARD AI - STANDALONE OFFLINE-FIRST FIELD ENGINE
echo   SANS 10400-T / SANS 1475 / NZS 4503 / Web Crypto SHA-256
echo ========================================================
echo.
echo [1/2] Checking local offline server...
cd /d "%~dp0"

echo [2/2] Launching PyroGuard AI in your browser...
start http://localhost:3000

echo.
echo Server is running offline on your local device.
echo Press Ctrl+C in this window if you ever wish to stop it.
echo.
npm.cmd start
pause
