@echo off
setlocal
for %%P in (3000 5173 5174) do (
  for /f "tokens=5" %%p in ('netstat -ano ^| findstr :%%P') do taskkill /pid %%p /F >nul 2>&1
)
echo OK
