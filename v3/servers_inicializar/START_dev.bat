@echo off
setlocal
set VITE_SERVER_URL=http://localhost:3000
start "SGFILA-DEV-SERVER" /D "%~dp0..\server" cmd /c "npm run dev"
start "SGFILA-DEV-CLIENT" /D "%~dp0..\client" cmd /c "npm run dev"
echo Dev watchers iniciados (server:3000, client:5173)
