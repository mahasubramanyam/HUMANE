# ==============================================================================
# HUMANE — Local Development Runner (PowerShell)
# Starts backend and frontend development servers
# ==============================================================================
Write-Host "Starting HUMANE Development Environment..." -ForegroundColor Cyan

# Start Backend API
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; .\.venv\Scripts\Activate.ps1; uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"

# Start Frontend App
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "Backend launching at http://127.0.0.1:8000" -ForegroundColor Green
Write-Host "Frontend launching at http://localhost:3000" -ForegroundColor Green
