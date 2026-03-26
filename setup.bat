@echo off
echo ========================================
echo   Project Dashboard Setup - Velozity
echo ========================================
echo.

echo Creating environment files...
echo.

echo [1/2] Creating backend .env file...
(
echo DATABASE_URL="postgresql://neondb_owner:npg_OjkzrpUmE7i0@ep-misty-wind-amsnuiq5-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
echo JWT_ACCESS_SECRET=your-super-secret-access-key-change-in-production-velozity-2026
echo JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-in-production-velozity-2026
echo PORT=5000
echo NODE_ENV=development
echo FRONTEND_URL=http://localhost:3000
) > backend\.env
echo    ✓ Backend .env created

echo.
echo [2/2] Creating frontend .env file...
(
echo REACT_APP_API_URL=http://localhost:5000
echo REACT_APP_WS_URL=http://localhost:5000
) > frontend\.env
echo    ✓ Frontend .env created

echo.
echo ========================================
echo   Environment Setup Complete!
echo ========================================
echo.
echo Next steps:
echo   1. Run: INSTALL.bat (to install dependencies)
echo   2. Run: setup-db.bat (to setup database)
echo   3. Run: START.bat (to start the application)
echo.
echo Or run all at once: INSTALL.bat ^&^& setup-db.bat ^&^& START.bat
echo.
pause
