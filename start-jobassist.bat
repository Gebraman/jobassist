@echo off
echo ========================================================
echo   Starting JobAssist Rebuilt Platform
echo   URL: http://localhost:3001/checkout?utm_source=Facebook
echo ========================================================
cd /d "%~dp0"
node server.js
pause
