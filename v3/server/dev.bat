@echo off
echo ====================================
echo SGFILA v3.0 - Server
echo ====================================
echo.

cd /d "%~dp0"

echo Iniciando servidor TypeScript...
node_modules\.bin\tsx.cmd watch src/server.ts
