@echo off
echo ====================================
echo SGFILA v3.0 - Server
echo ====================================
echo.

cd /d "%~dp0"

echo Iniciando servidor TypeScript...
echo.

node node_modules/tsx/dist/cli.mjs watch src/server.ts

