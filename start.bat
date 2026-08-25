@echo off
title FramX AI - Smart Agricultural Marketplace
color 0A
cls

echo.
echo  ========================================================================
echo   FramX.AI ^| AI-Powered Farmer-to-Market Digital Platform
echo  ========================================================================
echo.

:: ── Step 1: Install Python backend dependencies ──────────────────────────
echo  [1/4] Installing Python backend dependencies...
py -3.13 -m pip install -r backend\requirements.txt --quiet
if %errorlevel% neq 0 (
    echo  [ERROR] Python/pip not found. Please install Python 3.10+ from python.org
    pause
    exit /b 1
)
echo  [1/4] Backend dependencies ready!

:: ── Step 2: Install Node / npm frontend dependencies ─────────────────────
echo  [2/4] Installing frontend Node dependencies...
cd frontend
call npm install --silent
if %errorlevel% neq 0 (
    echo  [ERROR] npm not found. Please install Node.js from nodejs.org
    pause
    exit /b 1
)
cd ..
echo  [2/4] Frontend dependencies ready!

:: ── Step 3: Launch FastAPI Backend ────────────────────────────────────────
echo  [3/4] Starting FastAPI Backend on http://127.0.0.1:8000 ...
start "FramX-Backend" cmd /k "color 0B && title FramX AI Backend && py -3.13 -m uvicorn backend.app.main:app --port 8000 --host 127.0.0.1 --reload"

:: Wait for backend to boot
timeout /t 3 /nobreak >nul

:: ── Step 4: Launch Vite React Frontend ────────────────────────────────────
echo  [4/4] Starting React Frontend on http://127.0.0.1:5173 ...
start "FramX-Frontend" cmd /k "color 0D && title FramX AI Frontend && cd /d %~dp0frontend && npm run dev -- --host 127.0.0.1 --port 5173"

:: Wait a moment then open browser
timeout /t 4 /nobreak >nul
start "" http://127.0.0.1:5173

echo.
echo  ========================================================================
echo   FramX AI is now LIVE!
echo  ========================================================================
echo.
echo   Frontend App  : http://127.0.0.1:5173
echo   API Docs      : http://127.0.0.1:8000/docs
echo.
echo   Demo Accounts :
echo     Farmer   --  farmer@agrilink.ai  /  farmer123
echo     Buyer    --  buyer@agrilink.ai   /  buyer123
echo     Admin    --  admin@agrilink.ai   /  admin123
echo.
echo   (Close the backend and frontend windows to stop the server)
echo  ========================================================================
echo.
pause
