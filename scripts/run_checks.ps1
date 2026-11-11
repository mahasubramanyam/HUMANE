# ==============================================================================
# HUMANE — Full Local Quality & Verification Checks
# ==============================================================================
$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Running HUMANE Verification Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Backend Checks
Write-Host "`n[1/4] Running Backend Ruff Linting..." -ForegroundColor Yellow
Push-Location backend
try {
    & .\.venv\Scripts\ruff check .
    Write-Host "✔ Backend Ruff linting passed." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n[2/4] Running Backend Pytest Suite..." -ForegroundColor Yellow
Push-Location backend
try {
    & .\.venv\Scripts\pytest -v
    Write-Host "✔ Backend Pytest tests passed." -ForegroundColor Green
} finally {
    Pop-Location
}

# 2. Frontend Checks
Write-Host "`n[3/4] Running Frontend Type Check & Linting..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm run type-check
    npm run lint
    Write-Host "✔ Frontend TypeScript & ESLint checks passed." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n[4/4] Running Frontend Vitest & Production Build..." -ForegroundColor Yellow
Push-Location frontend
try {
    npm test
    npm run build
    Write-Host "✔ Frontend unit tests and build passed." -ForegroundColor Green
} finally {
    Pop-Location
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " All HUMANE Foundation Checks Passed!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
