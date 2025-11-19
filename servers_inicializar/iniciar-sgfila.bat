@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ====================================================================
:: SGFILA - Script Robusto de Inicialização
:: ====================================================================
:: Inicializa os servidores backend e frontend com configuração
:: persistente e tratamento de erros robusto
:: ====================================================================

set "SCRIPT_DIR=%~dp0"
set "CONFIG_FILE=%SCRIPT_DIR%config.ini"
set "LOG_DIR=%SCRIPT_DIR%logs"
set "LOG_FILE=%LOG_DIR%\sgfila_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

:: Criar diretório de logs se não existir
if not exist "%LOG_DIR%" mkdir "%LOG_DIR%"

:: ====================================================================
:: FUNÇÕES
:: ====================================================================

:log
echo [%date% %time:~0,8%] %* >> "%LOG_FILE%"
echo [%time:~0,8%] %*
exit /b 0

:erro
call :log [ERRO] %*
echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║ ERRO ENCONTRADO                                                ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.
echo %*
echo.
echo Verifique o arquivo de log: %LOG_FILE%
echo.
pause
exit /b 1

:sucesso
call :log [OK] %*
exit /b 0

:info
call :log [INFO] %*
exit /b 0

:: ====================================================================
:: CABEÇALHO
:: ====================================================================

cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  SGFILA v3.0 - Inicializador de Servidores
echo ════════════════════════════════════════════════════════════════
echo.
call :info "Iniciando script de configuração e inicialização..."
echo.

:: ====================================================================
:: CARREGAR/CRIAR CONFIGURAÇÃO
:: ====================================================================

call :info "Verificando arquivo de configuração..."

:: Criar config.ini se não existir
if not exist "%CONFIG_FILE%" (
    call :info "Arquivo de configuração não encontrado. Criando padrão..."
    (
        echo # Configurações do SGFILA
        echo # Editado automaticamente pelo script
        echo.
        echo [NODE]
        echo # Caminho para o executável do Node.js portátil
        echo NODE_PATH=C:\portable\node\node.exe
        echo.
        echo [PORTAS]
        echo # Portas dos servidores
        echo PORT_BACKEND=3000
        echo PORT_FRONTEND=5173
        echo.
        echo [PATHS]
        echo # Caminhos relativos ao diretório raiz do projeto
        echo DIR_BACKEND=..\v3\server
        echo DIR_FRONTEND=..\v3\client
        echo.
        echo [OPCOES]
        echo # Opções de inicialização
        echo AUTO_OPEN_BROWSER=false
        echo RESTART_ON_ERROR=false
        echo WAIT_BACKEND_SECONDS=5
    ) > "%CONFIG_FILE%"
    call :sucesso "Arquivo de configuração criado: %CONFIG_FILE%"
    echo.
    echo O arquivo foi criado com valores padrão.
    echo Você pode editá-lo manualmente antes de continuar.
    echo.
    choice /C SN /M "Deseja continuar agora"
    if errorlevel 2 (
        call :info "Configuração cancelada pelo usuário."
        pause
        exit /b 0
    )
)

:: ====================================================================
:: LER CONFIGURAÇÃO
:: ====================================================================

call :info "Lendo configurações..."

:: Variáveis padrão
set "NODE_PATH_DEFAULT=C:\portable\node\node.exe"
set "PORT_BACKEND=3000"
set "PORT_FRONTEND=5173"
set "DIR_BACKEND=..\v3\server"
set "DIR_FRONTEND=..\v3\client"
set "AUTO_OPEN_BROWSER=false"
set "RESTART_ON_ERROR=false"
set "WAIT_BACKEND_SECONDS=5"

:: Ler arquivo de configuração
for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
    set "linha=%%a"
    set "valor=%%b"

    :: Ignorar comentários e linhas vazias
    if not "!linha:~0,1!"=="#" if not "!linha!"=="" if not "!linha:~0,1!"=="[" (
        if "%%a"=="NODE_PATH" set "NODE_PATH=%%b"
        if "%%a"=="PORT_BACKEND" set "PORT_BACKEND=%%b"
        if "%%a"=="PORT_FRONTEND" set "PORT_FRONTEND=%%b"
        if "%%a"=="DIR_BACKEND" set "DIR_BACKEND=%%b"
        if "%%a"=="DIR_FRONTEND" set "DIR_FRONTEND=%%b"
        if "%%a"=="AUTO_OPEN_BROWSER" set "AUTO_OPEN_BROWSER=%%b"
        if "%%a"=="RESTART_ON_ERROR" set "RESTART_ON_ERROR=%%b"
        if "%%a"=="WAIT_BACKEND_SECONDS" set "WAIT_BACKEND_SECONDS=%%b"
    )
)

:: ====================================================================
:: MENU DE CONFIGURAÇÃO DO NODE
:: ====================================================================

:menu_node
cls
echo.
echo ════════════════════════════════════════════════════════════════
echo  Configuração do Node.js
echo ════════════════════════════════════════════════════════════════
echo.
echo Caminho atual configurado:
echo %NODE_PATH%
echo.
echo Opções:
echo  [P] Usar caminho padrão (salvar como novo padrão)
echo  [A] Informar caminho alternativo (apenas desta vez)
echo  [C] Configurar novo caminho padrão permanente
echo  [T] Testar caminho atual
echo  [S] Sair/Cancelar
echo.
choice /C PACTS /N /M "Escolha uma opção: "
set "opcao=%errorlevel%"

if "%opcao%"=="1" goto usar_padrao
if "%opcao%"=="2" goto usar_alternativo
if "%opcao%"=="3" goto configurar_padrao
if "%opcao%"=="4" goto testar_node
if "%opcao%"=="5" (
    call :info "Operação cancelada pelo usuário."
    exit /b 0
)

:usar_padrao
set "NODE_EXE=%NODE_PATH%"
call :info "Usando caminho padrão: %NODE_EXE%"
goto validar_node

:usar_alternativo
echo.
set /p "NODE_TEMP=Digite o caminho completo para o node.exe: "
set "NODE_EXE=%NODE_TEMP%"
call :info "Usando caminho alternativo (temporário): %NODE_EXE%"
goto validar_node

:configurar_padrao
echo.
set /p "NODE_NOVO=Digite o novo caminho padrão para o node.exe: "

:: Testar novo caminho
if not exist "%NODE_NOVO%" (
    call :erro "Arquivo não encontrado: %NODE_NOVO%"
    echo.
    choice /C SN /M "Tentar novamente"
    if errorlevel 1 if not errorlevel 2 goto configurar_padrao
    goto menu_node
)

"%NODE_NOVO%" --version >nul 2>&1
if errorlevel 1 (
    call :erro "O arquivo existe mas não é um executável Node.js válido."
    echo.
    choice /C SN /M "Tentar novamente"
    if errorlevel 1 if not errorlevel 2 goto configurar_padrao
    goto menu_node
)

:: Salvar no config.ini
call :info "Salvando novo caminho padrão..."

:: Criar arquivo temporário com nova configuração
set "CONFIG_TEMP=%CONFIG_FILE%.tmp"
(
    for /f "usebackq tokens=1,* delims==" %%a in ("%CONFIG_FILE%") do (
        if "%%a"=="NODE_PATH" (
            echo NODE_PATH=%NODE_NOVO%
        ) else (
            echo %%a=%%b
        )
    )
) > "%CONFIG_TEMP%"

:: Substituir arquivo original
move /y "%CONFIG_TEMP%" "%CONFIG_FILE%" >nul

set "NODE_PATH=%NODE_NOVO%"
set "NODE_EXE=%NODE_NOVO%"
call :sucesso "Novo caminho padrão salvo com sucesso!"
timeout /t 2 >nul
goto validar_node

:testar_node
echo.
call :info "Testando Node.js..."
echo.

if not exist "%NODE_PATH%" (
    call :erro "Node.js não encontrado em: %NODE_PATH%"
    pause
    goto menu_node
)

"%NODE_PATH%" --version
if errorlevel 1 (
    call :erro "Falha ao executar Node.js"
    pause
    goto menu_node
)

call :sucesso "Node.js está funcionando corretamente!"
pause
goto menu_node

:: ====================================================================
:: VALIDAR NODE.JS
:: ====================================================================

:validar_node
echo.
call :info "Validando Node.js..."

if not exist "%NODE_EXE%" (
    call :erro "Node.js não encontrado em: %NODE_EXE%"
    goto menu_node
)

:: Testar execução
"%NODE_EXE%" --version >nul 2>&1
if errorlevel 1 (
    call :erro "Falha ao executar Node.js. Verifique o caminho."
    goto menu_node
)

:: Obter versão
for /f "tokens=*" %%v in ('"%NODE_EXE%" --version') do set "NODE_VERSION=%%v"
call :sucesso "Node.js %NODE_VERSION% validado com sucesso!"

:: ====================================================================
:: VALIDAR DIRETÓRIOS
:: ====================================================================

call :info "Validando diretórios do projeto..."

:: Converter caminhos relativos para absolutos
pushd "%SCRIPT_DIR%"
cd "%DIR_BACKEND%" 2>nul || (
    call :erro "Diretório do backend não encontrado: %DIR_BACKEND%"
    exit /b 1
)
set "DIR_BACKEND_ABS=%CD%"
popd

pushd "%SCRIPT_DIR%"
cd "%DIR_FRONTEND%" 2>nul || (
    call :erro "Diretório do frontend não encontrado: %DIR_FRONTEND%"
    exit /b 1
)
set "DIR_FRONTEND_ABS=%CD%"
popd

call :sucesso "Backend: %DIR_BACKEND_ABS%"
call :sucesso "Frontend: %DIR_FRONTEND_ABS%"

:: Verificar package.json
if not exist "%DIR_BACKEND_ABS%\package.json" (
    call :erro "package.json não encontrado no backend!"
    exit /b 1
)

if not exist "%DIR_FRONTEND_ABS%\package.json" (
    call :erro "package.json não encontrado no frontend!"
    exit /b 1
)

:: ====================================================================
:: VERIFICAR DEPENDÊNCIAS
:: ====================================================================

call :info "Verificando dependências..."

:: Backend
if not exist "%DIR_BACKEND_ABS%\node_modules" (
    echo.
    echo ┌────────────────────────────────────────────────────────────┐
    echo │ ATENÇÃO: Dependências do backend não instaladas           │
    echo └────────────────────────────────────────────────────────────┘
    echo.
    choice /C SN /M "Deseja instalar agora"
    if errorlevel 1 if not errorlevel 2 (
        call :info "Instalando dependências do backend..."
        cd /d "%DIR_BACKEND_ABS%"
        "%NODE_EXE%" "%DIR_BACKEND_ABS%\node_modules\npm\bin\npm-cli.js" install || "%NODE_EXE%" -e "require('child_process').execSync('npm install', {stdio:'inherit'})"
        if errorlevel 1 (
            call :erro "Falha ao instalar dependências do backend"
            exit /b 1
        )
        call :sucesso "Dependências do backend instaladas!"
    ) else (
        call :erro "Backend precisa de dependências instaladas para funcionar!"
        exit /b 1
    )
)

:: Frontend
if not exist "%DIR_FRONTEND_ABS%\node_modules" (
    echo.
    echo ┌────────────────────────────────────────────────────────────┐
    echo │ ATENÇÃO: Dependências do frontend não instaladas          │
    echo └────────────────────────────────────────────────────────────┘
    echo.
    choice /C SN /M "Deseja instalar agora"
    if errorlevel 1 if not errorlevel 2 (
        call :info "Instalando dependências do frontend..."
        cd /d "%DIR_FRONTEND_ABS%"
        "%NODE_EXE%" "%DIR_FRONTEND_ABS%\node_modules\npm\bin\npm-cli.js" install || "%NODE_EXE%" -e "require('child_process').execSync('npm install', {stdio:'inherit'})"
        if errorlevel 1 (
            call :erro "Falha ao instalar dependências do frontend"
            exit /b 1
        )
        call :sucesso "Dependências do frontend instaladas!"
    ) else (
        call :erro "Frontend precisa de dependências instaladas para funcionar!"
        exit /b 1
    )
)

:: ====================================================================
:: VERIFICAR PORTAS
:: ====================================================================

call :info "Verificando disponibilidade de portas..."

:: Verificar porta backend
netstat -ano | findstr ":%PORT_BACKEND% " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo.
    echo ┌────────────────────────────────────────────────────────────┐
    echo │ AVISO: Porta %PORT_BACKEND% já está em uso                           │
    echo └────────────────────────────────────────────────────────────┘
    echo.
    echo Possíveis causas:
    echo - Backend já está rodando
    echo - Outro aplicativo está usando a porta
    echo.
    choice /C CS /M "Deseja [C]ontinuar mesmo assim ou [S]air"
    if errorlevel 2 exit /b 0
)

:: Verificar porta frontend
netstat -ano | findstr ":%PORT_FRONTEND% " | findstr "LISTENING" >nul
if not errorlevel 1 (
    echo.
    echo ┌────────────────────────────────────────────────────────────┐
    echo │ AVISO: Porta %PORT_FRONTEND% já está em uso                          │
    echo └────────────────────────────────────────────────────────────┘
    echo.
    choice /C CS /M "Deseja [C]ontinuar mesmo assim ou [S]air"
    if errorlevel 2 exit /b 0
)

:: ====================================================================
:: INICIAR SERVIDORES
:: ====================================================================

echo.
echo ════════════════════════════════════════════════════════════════
echo  Iniciando Servidores
echo ════════════════════════════════════════════════════════════════
echo.

:: Criar arquivos de log individuais
set "LOG_BACKEND=%LOG_DIR%\backend_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"
set "LOG_FRONTEND=%LOG_DIR%\frontend_%date:~-4,4%%date:~-7,2%%date:~-10,2%.log"

:: 1. Iniciar Backend (PRIMEIRO - obrigatório)
call :info "Iniciando servidor backend na porta %PORT_BACKEND%..."
cd /d "%DIR_BACKEND_ABS%"

start "SGFILA - Backend" /min cmd /c ""%NODE_EXE%" --loader tsx --experimental-specifier-resolution=node src/server.ts >> "%LOG_BACKEND%" 2>&1"

if errorlevel 1 (
    call :erro "Falha ao iniciar backend!"
    exit /b 1
)

call :sucesso "Backend iniciado! (minimizado)"

:: Aguardar backend inicializar
call :info "Aguardando %WAIT_BACKEND_SECONDS% segundos para o backend inicializar..."
timeout /t %WAIT_BACKEND_SECONDS% /nobreak >nul

:: Verificar se backend está rodando
netstat -ano | findstr ":%PORT_BACKEND% " | findstr "LISTENING" >nul
if errorlevel 1 (
    call :erro "Backend não iniciou corretamente. Verifique o log: %LOG_BACKEND%"
    type "%LOG_BACKEND%"
    pause
    exit /b 1
)

call :sucesso "Backend está respondendo na porta %PORT_BACKEND%!"

:: 2. Iniciar Frontend
call :info "Iniciando servidor frontend na porta %PORT_FRONTEND%..."
cd /d "%DIR_FRONTEND_ABS%"

start "SGFILA - Frontend" /min cmd /c ""%NODE_EXE%" node_modules\vite\bin\vite.js >> "%LOG_FRONTEND%" 2>&1"

if errorlevel 1 (
    call :erro "Falha ao iniciar frontend!"
    exit /b 1
)

call :sucesso "Frontend iniciado! (minimizado)"

:: Aguardar frontend inicializar
call :info "Aguardando 3 segundos para o frontend inicializar..."
timeout /t 3 /nobreak >nul

:: ====================================================================
:: FINALIZAÇÃO
:: ====================================================================

echo.
echo ════════════════════════════════════════════════════════════════
echo  Servidores Iniciados com Sucesso!
echo ════════════════════════════════════════════════════════════════
echo.
echo  Backend:  http://localhost:%PORT_BACKEND%
echo  Frontend: http://localhost:%PORT_FRONTEND%
echo.
echo  Logs:
echo  - Backend:  %LOG_BACKEND%
echo  - Frontend: %LOG_FRONTEND%
echo  - Geral:    %LOG_FILE%
echo.
echo ════════════════════════════════════════════════════════════════
echo.

:: Abrir navegador se configurado
if /i "%AUTO_OPEN_BROWSER%"=="true" (
    call :info "Abrindo navegador..."
    start http://localhost:%PORT_FRONTEND%
)

call :info "Script finalizado com sucesso!"
echo.
echo Pressione qualquer tecla para sair...
echo (Os servidores continuarão rodando em segundo plano)
pause >nul

exit /b 0
