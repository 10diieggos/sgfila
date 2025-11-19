@echo off
setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "CONFIG=%SCRIPT_DIR%config.txt"

echo.
echo ========================================
echo SGFILA v3 - Inicializador
echo ========================================
echo.

if not exist "%CONFIG%" (
    echo Criando arquivo de configuracao...
    echo C:\portable\node\node.exe> "%CONFIG%"
    echo Arquivo config.txt criado!
    echo Edite o arquivo e coloque o caminho do node.exe
    echo Depois execute este script novamente.
    pause
    exit /b 0
)

set /p NODE_PATH=<"%CONFIG%"

if not exist "%NODE_PATH%" (
    echo ERRO: Node.js nao encontrado em: %NODE_PATH%
    echo.
    echo Edite o arquivo config.txt e corrija o caminho.
    pause
    exit /b 1
)

echo Testando Node.js...
"%NODE_PATH%" --version
if errorlevel 1 (
    echo ERRO: Falha ao executar Node.js
    pause
    exit /b 1
)

echo OK! Node.js encontrado.
echo.

cd /d "%SCRIPT_DIR%..\v3\server"
if errorlevel 1 (
    echo ERRO: Pasta do servidor nao encontrada
    pause
    exit /b 1
)

echo Compilando shared types...
cd /d "%SCRIPT_DIR%..\v3\shared"
"%NODE_PATH%" "%SCRIPT_DIR%..\v3\server\node_modules\typescript\lib\tsc.js" types.ts --module ESNext --target ES2022 --moduleResolution node --esModuleInterop >nul 2>&1

echo Compilando backend TypeScript...
cd /d "%SCRIPT_DIR%..\v3\server"
"%NODE_PATH%" "%SCRIPT_DIR%..\v3\server\node_modules\typescript\lib\tsc.js" -p tsconfig.json
if errorlevel 1 (
    echo ERRO: Falha ao compilar TypeScript
    pause
    exit /b 1
)

echo Iniciando backend...
start "SGFILA Backend" /min "%NODE_PATH%" dist/server.js

timeout /t 5 /nobreak >nul

cd /d "%SCRIPT_DIR%..\v3\client"
if errorlevel 1 (
    echo ERRO: Pasta do cliente nao encontrada
    pause
    exit /b 1
)

echo Iniciando frontend...
start "SGFILA Frontend" /min "%NODE_PATH%" node_modules\vite\bin\vite.js

echo.
echo ========================================
echo Servidores iniciados!
echo ========================================
echo.
echo Backend:  http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo As janelas estao minimizadas.
echo.
pause
