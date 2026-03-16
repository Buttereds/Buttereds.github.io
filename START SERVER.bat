@echo off
echo Starting portfolio server...
cd /d "%~dp0"
start "" "http://localhost:3000"
node serve.mjs
pause
