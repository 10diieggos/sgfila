@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ====================================================================
:: SGFILA - Script para Parar Servidores
:: ====================================================================

set "SCRIPT_DIR=%~dp0"
set "CONFIG_FILE=%SCRIPT_DIR%config.ini"

cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  SGFILA v3.0 - Parar Servidores
echo ════════════════════════════════════════════════════════════════
echo.

:: Ler portas do config
set "PORT_BACKEND=3000"
set "PORT_FRONTEND=5173"

if exist "%CONFIG_FILE%" (
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        if "%%a"=="PORT_BACKEND" set "PORT_BACKEND=%%b"
        if "%%a"=="PORT_FRONTEND" set "PORT_FRONTEND=%%b"
    )
)

echo Procurando servidores SGFILA...
echo.

:: Encontrar e matar processos nas portas
set "KILLED=0"

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT_BACKEND% " ^| findstr "LISTENING"') do (
    set "PID=%%a"
    echo Parando backend (PID !PID!) na porta %PORT_BACKEND%...
    taskkill /F /PID !PID! >nul 2>&1
    if not errorlevel 1 (
        echo [OK] Backend parado com sucesso!
        set "KILLED=1"
    ) else (
        echo [ERRO] Falha ao parar backend
    )
)

for /f "tokens=5" %%a in ('netstat -ano ^| findstr ":%PORT_FRONTEND% " ^| findstr "LISTENING"') do (
    set "PID=%%a"
    echo Parando frontend (PID !PID!) na porta %PORT_FRONTEND%...
    taskkill /F /PID !PID! >nul 2>&1
    if not errorlevel 1 (
        echo [OK] Frontend parado com sucesso!
        set "KILLED=1"
    ) else (
        echo [ERRO] Falha ao parar frontend
    )
)

:: Tentar matar janelas pelo título
taskkill /FI "WINDOWTITLE eq SGFILA - Backend" /F >nul 2>&1
if not errorlevel 1 set "KILLED=1"

taskkill /FI "WINDOWTITLE eq SGFILA - Frontend" /F >nul 2>&1
if not errorlevel 1 set "KILLED=1"

echo.
if "%KILLED%"=="1" (
    echo ════════════════════════════════════════════════════════════════
    echo  Servidores parados com sucesso!
    echo ════════════════════════════════════════════════════════════════
) else (
    echo ════════════════════════════════════════════════════════════════
    echo  Nenhum servidor SGFILA em execução encontrado
    echo ════════════════════════════════════════════════════════════════
)
echo.
pause
