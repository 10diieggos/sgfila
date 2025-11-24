@echo off
setlocal
set NODE_ENV=production
set HOST=0.0.0.0
set PORT=3000
set CORS_ORIGIN=http://localhost:%PORT%
cd /d "%~dp0\..\..\build\SGFila\server"
node "dist\server\src\server.js"
