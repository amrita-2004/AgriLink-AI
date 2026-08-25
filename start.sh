#!/bin/bash
echo "======================================================================"
echo "Starting AgriLink AI - AI-Powered Farmer-to-Market Digital Platform"
echo "======================================================================"

echo "[1/2] Starting FastAPI Backend on http://127.0.0.1:8000 ..."
python -m uvicorn backend.app.main:app --port 8000 --host 127.0.0.1 --reload &
BACKEND_PID=$!

echo "[2/2] Starting React Vite Frontend on http://127.0.0.1:5173 ..."
cd frontend && npm run dev -- --host 127.0.0.1 --port 5173 &
FRONTEND_PID=$!

echo "AgriLink AI is running!"
echo "Frontend: http://127.0.0.1:5173"
echo "Backend:  http://127.0.0.1:8000/docs"

wait $BACKEND_PID $FRONTEND_PID
