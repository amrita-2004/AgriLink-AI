@echo off
echo ======================================================================
echo Starting AgriLink AI - AI-Powered Farmer-to-Market Digital Platform
echo ======================================================================

echo [1/2] Launching FastAPI Backend Server on http://127.0.0.1:8000 ...
start "AgriLink-Backend" py -3.13 -m uvicorn backend.app.main:app --port 8000 --host 127.0.0.1 --reload

echo [2/2] Launching Vite React Frontend on http://127.0.0.1:5173 ...
cd frontend
start "AgriLink-Frontend" npm run dev -- --host 127.0.0.1 --port 5173

echo.
echo ======================================================================
echo AgriLink AI Platform is LIVE!
echo Frontend: http://127.0.0.1:5173
echo Backend API Docs: http://127.0.0.1:8000/docs
echo Demo Credentials:
echo   - Farmer:   farmer@agrilink.ai   / farmer123
echo   - Buyer:    buyer@agrilink.ai    / buyer123
echo   - Admin:    admin@agrilink.ai    / admin123
echo ======================================================================
pause
