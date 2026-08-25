@echo off
chcp 65001 >nul
cd /d "%~dp0"
echo 启动开发服务器（热更新模式）...
echo 访问地址: http://localhost:5173
echo.
call npm run dev -- --host 0.0.0.0
pause
