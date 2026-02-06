# RefData

A web application for managing reference/lookup data structures (e.g., country codes, status types, category lists).

## Stack

- **Backend:** FastAPI (Python) with MongoDB (motor async driver)
- **Frontend:** Vite + React
- **Database:** MongoDB

## Quick Start

### 1. Start MongoDB

Ensure MongoDB is running on `localhost:27017`.

### 2. Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs: http://localhost:8000/docs

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173
