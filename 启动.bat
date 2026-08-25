@echo off
chcp 65001 >nul
echo ========================================
echo   宝贝学习乐园 - 启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] 检查依赖...
if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install --no-audit --no-fund
) else (
    echo 依赖已安装
)

echo.
echo [2/3] 构建项目...
call npm run build

echo.
echo [3/3] 启动预览服务器...
echo.
echo ========================================
echo   应用已启动！
echo   本地访问: http://localhost:4173
echo   按 Ctrl+C 停止服务器
echo ========================================
echo.
call npm run preview -- --host 0.0.0.0 --port 4173

pause
