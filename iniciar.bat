@echo off
REM ========================================
REM SGFILA v3.0 - Iniciar Servidor
REM ========================================

setlocal EnableDelayedExpansion

REM Guardar diretorio inicial
set SCRIPT_DIR=%CD%

REM Detectar Node.js
if exist "..\node.exe" (
    set NODE_DIR=%CD%\..
) else if exist "..\..\node.exe" (
    set NODE_DIR=%CD%\..\..
) else (
    echo ERRO: Node.js nao encontrado!
    echo.
    echo Certifique-se de que node.exe esta na pasta pai ou edite este script.
    pause
    exit /b 1
)

REM Adicionar Node.js ao PATH
set PATH=!NODE_DIR!;%PATH%

echo ========================================
echo SGFILA v3.0 - Sistema de Filas
echo ========================================
echo.
echo Iniciando servidor...
echo.
echo Para acessar o sistema:
echo   - Local: http://localhost:3000
echo   - Rede: http://[SEU-IP]:3000
echo.
echo Pressione Ctrl+C para encerrar o servidor
echo ========================================
echo.

cd v3\server
node dist\server\src\server.js

pause
