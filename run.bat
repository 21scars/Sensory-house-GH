@echo off
echo Installing dependencies...
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo Dependency installation failed.
    pause
    exit /b %ERRORLEVEL%
)

echo Running Database Generate...
call npm run db:generate
if %ERRORLEVEL% neq 0 (
    echo Database generation failed.
    pause
    exit /b %ERRORLEVEL%
)

echo Pushing Database Schema...
call npm run db:push
if %ERRORLEVEL% neq 0 (
    echo Database push failed.
    pause
    exit /b %ERRORLEVEL%
)

echo Starting Development Server...
call npm run dev
