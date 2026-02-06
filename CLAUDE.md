# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

RefData — a web application for managing reference/lookup data structures. Built with FastAPI (Python) + Vite/React (UI) + MongoDB.

## Structure

- `plans/` — project planning documents
- `backend/` — FastAPI backend (Python)
- `frontend/` — Vite + React frontend

## Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- MongoDB running on localhost:27017

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```
API docs available at http://localhost:8000/docs

### Frontend
```bash
cd frontend
npm install
npm run dev
```
Runs on http://localhost:5173, proxies `/api` requests to the backend.

## Environment Variables
- `MONGO_URL` — MongoDB connection string (default: `mongodb://localhost:27017`)
- `DB_NAME` — database name (default: `refdata`)
