@echo off
echo =========================================
echo  SENSORY HOUSE - Admin Setup
echo =========================================
echo.

echo [1/4] Installing dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo Dependency installation failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [2/4] Syncing database...
call npm run db:generate
call npm run db:push
if %ERRORLEVEL% neq 0 (
    echo Database sync failed.
    pause
    exit /b %ERRORLEVEL%
)

echo [3/4] Seeding admin credentials...
call npm run db:seed
if %ERRORLEVEL% neq 0 (
    echo Seeding failed.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =========================================
echo  ADMIN ACCESS INFORMATION
echo  URL: http://localhost:3000/admin
echo  Email: admin@sensoryhouse.com
echo  Password: admin123!
echo =========================================
echo.

echo [4/4] Starting development server...
call npm run dev
