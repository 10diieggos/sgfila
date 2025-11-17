@echo off
REM ====================================
REM SGFILA v3.0 - Server (Node Portátil)
REM ====================================

echo ====================================
echo SGFILA v3.0 - Server
echo ====================================
echo.
echo Iniciando servidor TypeScript...
echo.

cd /d "%~dp0"

REM Detecta automaticamente o node.exe no caminho do npm
for %%i in ("%CD%") do set CURRENT_DIR=%%~fi
C:\Users\Diego\Downloads\nodep\node.exe node_modules/tsx/dist/cli.mjs watch src/server.ts

pause
