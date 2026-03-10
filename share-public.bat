@echo off
setlocal
cd /d "%~dp0"
echo.
echo Ensure local site is running on http://127.0.0.1:5173
echo Starting public tunnel...
echo.
"C:\Program Files (x86)\cloudflared\cloudflared.exe" tunnel --url http://127.0.0.1:5173 --no-autoupdate

