@echo off
echo ====================================
echo SGFILA v3.0 - Client
echo ====================================
echo.

cd /d "%~dp0"

echo Iniciando Vite dev server...
node_modules\.bin\vite.cmd
