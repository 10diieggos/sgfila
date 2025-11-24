@echo off
setlocal
set VITE_SERVER_URL=http://localhost:3000
start "SGFILA-DEV-SERVER" cmd /c "cd /d \"%~dp0\..\server\" && npm run dev"
start "SGFILA-DEV-CLIENT" cmd /c "cd /d \"%~dp0\..\client\" && npm run dev"
echo Dev watchers iniciados (server:3000, client:5173)
