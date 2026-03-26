@echo off
echo ========================================
echo   Database Setup - Project Dashboard
echo ========================================
echo.

cd backend

echo [1/3] Generating Prisma Client...
call npx prisma generate
if errorlevel 1 (
    echo Failed to generate Prisma client
    pause
    exit /b 1
)

echo.
echo [2/3] Running Database Migrations...
call npx prisma migrate deploy
if errorlevel 1 (
    echo Failed to run migrations
    pause
    exit /b 1
)

echo.
echo [3/3] Seeding Database...
call npx prisma db seed
if errorlevel 1 (
    echo Failed to seed database
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Database Setup Complete!
echo ========================================
echo.
echo Login Credentials:
echo   Admin:  admin@company.com / Admin@123
echo   PM:     pm1@company.com / PM@123
echo   Dev:    dev1@company.com / Dev@123
echo.
echo To start the application, run: START.bat
echo.
pause
