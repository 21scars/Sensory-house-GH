@echo off
setlocal enabledelayedexpansion

echo =========================================
echo  SENSORY HOUSE - Development Setup
echo =========================================
echo.

REM Kill any existing node processes
echo [1/6] Stopping existing processes...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM npm.cmd >nul 2>&1
timeout /t 2 /nobreak >nul

REM Clear problematic directories
echo [2/6] Clearing old files...
rmdir /s /q "%CD%\.next" >nul 2>&1
rmdir /s /q "%CD%\node_modules\.prisma" >nul 2>&1
del "%CD%\prisma\dev.db" >nul 2>&1

REM Install dependencies
echo [3/6] Installing dependencies...
call npm install --legacy-peer-deps
if !errorlevel! neq 0 (
    echo Error installing dependencies
    pause
    exit /b 1
)

REM Generate Prisma client
echo [4/6] Generating Prisma client...
call npm run db:generate
if !errorlevel! neq 0 (
    echo Error generating Prisma client
    pause
    exit /b 1
)

REM Push schema to database
echo [5/6] Creating SQLite database...
call npm run db:push
if !errorlevel! neq 0 (
    echo Error pushing schema to database
    pause
    exit /b 1
)

REM Start development server
echo [6/6] Starting development server...
echo.
echo =========================================
echo  Ready! Opening http://localhost:3000
echo =========================================
echo.
call npm run dev
