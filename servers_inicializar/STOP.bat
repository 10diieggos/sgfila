@echo off

echo.
echo ========================================
echo SGFILA - Parar Servidores
echo ========================================
echo.

taskkill /FI "WINDOWTITLE eq SGFILA Backend" /F >nul 2>&1
taskkill /FI "WINDOWTITLE eq SGFILA Frontend" /F >nul 2>&1

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":3000 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":5173 " ^| findstr "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo Servidores parados!
echo.
pause
