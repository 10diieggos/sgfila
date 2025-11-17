@echo off
echo ====================================
echo SGFILA v3.0 - Instalador
echo ====================================
echo.
echo Este script vai instalar todas as dependencias necessarias.
echo Pode demorar alguns minutos...
echo.
pause

cd /d "%~dp0"

REM Adiciona Node.js portátil ao PATH temporariamente
set "PATH=C:\Users\Diego\Downloads\nodep;%PATH%"

echo.
echo [1/2] Instalando dependencias do SERVIDOR...
echo ====================================
cd server
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERRO ao instalar dependencias do servidor!
    pause
    exit /b 1
)

echo.
echo [2/2] Instalando dependencias do CLIENTE...
echo ====================================
cd ..\client
npm install
if %errorlevel% neq 0 (
    echo.
    echo ERRO ao instalar dependencias do cliente!
    pause
    exit /b 1
)

echo.
echo ====================================
echo Instalacao concluida com sucesso!
echo ====================================
echo.
echo Agora voce pode iniciar o sistema:
echo 1. Duplo-clique em: server\start-server.bat
echo 2. Duplo-clique em: client\start-client.bat
echo.
pause
