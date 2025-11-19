@echo off
REM ========================================
REM SGFILA v3.0 - Script de Instalacao
REM ========================================
REM
REM Este script instala e configura o SGFILA v3.0
REM - Instala dependencias do servidor e cliente
REM - Compila o codigo TypeScript
REM - Faz build de producao
REM - Cria arquivo de dados inicial
REM - Cria script de inicializacao
REM

setlocal EnableDelayedExpansion

echo.
echo ========================================
echo SGFILA v3.0 - Instalacao Automatica
echo ========================================
echo.

REM ========================================
REM 1. Detectar Node.js Portatil
REM ========================================

echo [1/8] Detectando Node.js portatil...

REM Verificar se node.exe esta na pasta pai
if exist "..\node.exe" (
    set NODE_DIR=%CD%\..
    set NODE_PATH=..\node.exe
    set NPM_PATH=..\npm.cmd
    echo   - Node.js encontrado na pasta pai
) else if exist "..\..\node.exe" (
    set NODE_DIR=%CD%\..\..
    set NODE_PATH=..\..\node.exe
    set NPM_PATH=..\..\npm.cmd
    echo   - Node.js encontrado duas pastas acima
) else (
    echo   ERRO: Node.js portatil nao encontrado!
    echo.
    echo   Certifique-se de que:
    echo   - node.exe esta na pasta pai da pasta 'sg'
    echo   - OU edite este script e defina NODE_PATH manualmente
    echo.
    pause
    exit /b 1
)

REM Adicionar Node.js ao PATH temporariamente
set PATH=!NODE_DIR!;%PATH%
echo   - Node.js adicionado ao PATH temporario

REM Verificar versoes
echo.
echo Versoes detectadas:
!NODE_PATH! --version
!NPM_PATH! --version

if errorlevel 1 (
    echo   ERRO: Node.js nao pode ser executado!
    pause
    exit /b 1
)

echo   - Node.js configurado com sucesso
echo.

REM ========================================
REM 2. Instalar Dependencias do Servidor
REM ========================================

echo [2/8] Instalando dependencias do servidor...
cd v3\server

if exist "node_modules" (
    echo   - Pasta node_modules ja existe, pulando instalacao...
    echo   - Para reinstalar, delete a pasta 'v3\server\node_modules' primeiro
) else (
    echo   - Executando: npm install
    call ..\..\!NPM_PATH! install

    if errorlevel 1 (
        echo   ERRO: Falha ao instalar dependencias do servidor!
        cd ..\..
        pause
        exit /b 1
    )
    echo   - Dependencias do servidor instaladas!
)

echo.

REM ========================================
REM 3. Compilar Servidor (TypeScript)
REM ========================================

echo [3/8] Compilando codigo TypeScript do servidor...

if exist "dist" (
    echo   - Removendo build anterior...
    rmdir /s /q dist
)

echo   - Executando: npm run build
call ..\..\!NPM_PATH! run build

if errorlevel 1 (
    echo   ERRO: Falha ao compilar o servidor!
    cd ..\..
    pause
    exit /b 1
)

if not exist "dist\server.js" (
    echo   ERRO: Arquivo dist\server.js nao foi gerado!
    cd ..\..
    pause
    exit /b 1
)

echo   - Servidor compilado com sucesso!
echo.

REM ========================================
REM 4. Criar Arquivo de Dados Inicial
REM ========================================

echo [4/8] Verificando arquivo de dados...

if exist "dados.json" (
    echo   - Arquivo dados.json ja existe, preservando dados existentes
) else (
    echo   - Criando dados.json inicial...
    (
        echo {
        echo   "senhas": [],
        echo   "senhasHoje": 0,
        echo   "contadorPrioridade": 0,
        echo   "contadorContratual": 0,
        echo   "contadorNormal": 0,
        echo   "contadorPrioridadeDesdeUltimaNormal": 0,
        echo   "contadorContratualDesdeUltimaNormal": 0,
        echo   "proporcaoPrioridade": 2,
        echo   "proporcaoContratual": 1,
        echo   "atendimentosAtuais": {},
        echo   "guichesConfigurados": [],
        echo   "dataReinicioSistema": "2025-01-01"
        echo }
    ) > dados.json
    echo   - Arquivo dados.json criado!
)

cd ..\..
echo.

REM ========================================
REM 5. Instalar Dependencias do Cliente
REM ========================================

echo [5/8] Instalando dependencias do cliente...
cd v3\client

if exist "node_modules" (
    echo   - Pasta node_modules ja existe, pulando instalacao...
    echo   - Para reinstalar, delete a pasta 'v3\client\node_modules' primeiro
) else (
    echo   - Executando: npm install
    call ..\..\!NPM_PATH! install

    if errorlevel 1 (
        echo   ERRO: Falha ao instalar dependencias do cliente!
        cd ..\..
        pause
        exit /b 1
    )
    echo   - Dependencias do cliente instaladas!
)

echo.

REM ========================================
REM 6. Build de Producao do Cliente
REM ========================================

echo [6/8] Fazendo build de producao do cliente...

if exist "dist" (
    echo   - Removendo build anterior...
    rmdir /s /q dist
)

echo   - Executando: npm run build
call ..\..\!NPM_PATH! run build

if errorlevel 1 (
    echo   ERRO: Falha ao fazer build do cliente!
    cd ..\..
    pause
    exit /b 1
)

if not exist "dist\index.html" (
    echo   ERRO: Arquivo dist\index.html nao foi gerado!
    cd ..\..
    pause
    exit /b 1
)

echo   - Cliente compilado com sucesso!
echo.

cd ..\..

REM ========================================
REM 7. Criar Script de Inicializacao
REM ========================================

echo [7/8] Criando script de inicializacao...

(
    echo @echo off
    echo REM ========================================
    echo REM SGFILA v3.0 - Iniciar Servidor
    echo REM ========================================
    echo.
    echo setlocal
    echo.
    echo REM Detectar Node.js
    echo if exist "..\node.exe" ^(
    echo     set NODE_PATH=..\node.exe
    echo ^) else if exist "..\..\node.exe" ^(
    echo     set NODE_PATH=..\..\node.exe
    echo ^) else ^(
    echo     echo ERRO: Node.js nao encontrado!
    echo     pause
    echo     exit /b 1
    echo ^)
    echo.
    echo echo ========================================
    echo echo SGFILA v3.0 - Sistema de Filas
    echo echo ========================================
    echo echo.
    echo echo Iniciando servidor...
    echo echo.
    echo echo Para acessar o sistema:
    echo echo   - Local: http://localhost:3000
    echo echo   - Rede: http://[SEU-IP]:3000
    echo echo.
    echo echo Pressione Ctrl+C para encerrar o servidor
    echo echo ========================================
    echo echo.
    echo.
    echo cd v3\server
    echo %%NODE_PATH%% dist\server.js
    echo.
    echo pause
) > iniciar.bat

echo   - Script iniciar.bat criado!
echo.

REM ========================================
REM 8. Criar Script de Desenvolvimento
REM ========================================

echo [8/8] Criando scripts auxiliares...

REM Script para modo desenvolvimento do servidor
(
    echo @echo off
    echo REM Modo de desenvolvimento - Servidor
    echo setlocal
    echo.
    echo if exist "..\node.exe" ^(
    echo     set NPM_PATH=..\npm.cmd
    echo ^) else if exist "..\..\node.exe" ^(
    echo     set NPM_PATH=..\..\npm.cmd
    echo ^) else ^(
    echo     echo ERRO: Node.js nao encontrado!
    echo     pause
    echo     exit /b 1
    echo ^)
    echo.
    echo cd v3\server
    echo call %%NPM_PATH%% run dev:win
) > dev-server.bat

echo   - Script dev-server.bat criado!

REM Script para modo desenvolvimento do cliente
(
    echo @echo off
    echo REM Modo de desenvolvimento - Cliente
    echo setlocal
    echo.
    echo if exist "..\node.exe" ^(
    echo     set NPM_PATH=..\npm.cmd
    echo ^) else if exist "..\..\node.exe" ^(
    echo     set NPM_PATH=..\..\npm.cmd
    echo ^) else ^(
    echo     echo ERRO: Node.js nao encontrado!
    echo     pause
    echo     exit /b 1
    echo ^)
    echo.
    echo cd v3\client
    echo call %%NPM_PATH%% run dev:win
) > dev-client.bat

echo   - Script dev-client.bat criado!

REM Script de backup
(
    echo @echo off
    echo REM Fazer backup do arquivo de dados
    echo setlocal
    echo.
    echo set DATA=%%DATE:/=-%%
    echo set HORA=%%TIME::=-%%
    echo set HORA=%%HORA: =0%%
    echo.
    echo if not exist "backups" mkdir backups
    echo.
    echo copy v3\server\dados.json backups\dados_%%DATA%%_%%HORA%%.json
    echo.
    echo if errorlevel 1 ^(
    echo     echo ERRO: Falha ao criar backup!
    echo ^) else ^(
    echo     echo Backup criado: backups\dados_%%DATA%%_%%HORA%%.json
    echo ^)
    echo.
    echo pause
) > backup.bat

echo   - Script backup.bat criado!
echo.

REM ========================================
REM Instalacao Concluida
REM ========================================

echo ========================================
echo INSTALACAO CONCLUIDA COM SUCESSO!
echo ========================================
echo.
echo Proximos passos:
echo.
echo 1. Para INICIAR o sistema:
echo    - Execute: iniciar.bat
echo    - Ou: cd v3\server ^&^& ..\..\node.exe dist\server.js
echo.
echo 2. Para acessar o sistema:
echo    - Abra o navegador em: http://localhost:3000
echo    - Ou use o IP do servidor para acesso na rede
echo.
echo 3. Scripts disponiveis:
echo    - iniciar.bat      : Inicia o servidor
echo    - dev-server.bat   : Modo desenvolvimento (servidor)
echo    - dev-client.bat   : Modo desenvolvimento (cliente)
echo    - backup.bat       : Faz backup do dados.json
echo.
echo 4. Documentacao:
echo    - Leia INSTALACAO.md para mais detalhes
echo.
echo ========================================
echo.

pause
