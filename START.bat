@echo off
echo ========================================
echo   Starting Project Dashboard
echo ========================================
echo.

echo Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

timeout /t 5 /nobreak >nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo   Servers Starting...
echo ========================================
echo.
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Login Credentials:
echo   Admin:  admin@company.com / Admin@123
echo   PM:     pm1@company.com / PM@123
echo   Dev:    dev1@company.com / Dev@123
echo.
echo Press any key to close this window...
pause >nul
