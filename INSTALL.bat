@echo off
echo ========================================
echo   Quick Install - Project Dashboard
echo ========================================
echo.

echo [1/2] Installing Backend...
cd backend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [2/2] Installing Frontend...
cd ..\frontend
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Installation Complete!
echo ========================================
echo.
echo Next, run: setup-db.bat
echo.
pause
