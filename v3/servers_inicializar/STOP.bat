@echo off
setlocal
for /f "tokens=5" %%p in ('netstat -ano ^| findstr :3000') do (
  echo Encerrando processo na porta 3000 PID %%p
  taskkill /pid %%p /F >nul 2>&1
)
echo OK
