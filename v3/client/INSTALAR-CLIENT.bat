@echo off
echo ====================================
echo SGFILA v3.0 - Instalador do Cliente
echo ====================================
echo.

cd /d "%~dp0"

REM Adiciona Node.js portátil ao PATH temporariamente
set "PATH=C:\Users\Diego\Downloads\nodep;%PATH%"

echo Instalando dependencias do cliente...
echo Isso pode demorar alguns minutos...
echo.

npm install

if %errorlevel% neq 0 (
    echo.
    echo ====================================
    echo ERRO ao instalar dependencias!
    echo ====================================
    echo.
    pause
    exit /b 1
)

echo.
echo ====================================
echo Instalacao concluida com sucesso!
echo ====================================
echo.
echo Agora voce pode iniciar o cliente com:
echo   start-client.bat
echo.
pause
