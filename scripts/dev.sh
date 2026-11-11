#!/usr/bin/env bash
set -e

echo "Starting HUMANE Development Environment..."

# Trap SIGINT to kill background jobs
trap 'kill $(jobs -p)' EXIT

# Start backend
(
  cd backend
  source .venv/bin/activate
  uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
) &

# Start frontend
(
  cd frontend
  npm run dev
) &

wait
