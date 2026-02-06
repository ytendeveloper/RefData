# Plan: Reference Data Web Application

## Overview
Build a web app to manage reference/lookup data structures (e.g., "Country Codes" with elements like `{code: "US", name: "United States"}`).

**Stack:** FastAPI (Python) + Vite/React (UI) + MongoDB (database). No auth for now.

---

## Data Model

### Collection: `ref_structures`
```json
{
  "_id": ObjectId,
  "name": "Country Codes",           // unique
  "description": "ISO country codes",
  "fields": [
    {"name": "code", "type": "string", "required": true},
    {"name": "name", "type": "string", "required": true}
  ],
  "created_at": datetime,
  "updated_at": datetime
}
```

### Collection: `ref_elements`
```json
{
  "_id": ObjectId,
  "structure_id": ObjectId,           // FK to ref_structures
  "values": {"code": "US", "name": "United States"},
  "created_at": datetime,
  "updated_at": datetime
}
```

---

## API Endpoints (FastAPI)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/structures` | Create a new reference data structure |
| GET | `/api/structures` | List/search structures (query param: `?q=`) |
| GET | `/api/structures/{id}` | Get structure by ID (includes field definitions) |
| POST | `/api/structures/{id}/elements` | Add element(s) to a structure |
| GET | `/api/structures/{id}/elements` | Search elements within a structure (`?q=`) |

---

## React Pages

1. **Add Structure** (`/add`) — Form to define a new structure: name, description, dynamic field definitions (add/remove fields), then optionally add initial elements
2. **Search Elements** (`/elements`) — Select a structure, then search/filter its element values
3. **Search Structures** (`/structures`) — Search/browse all reference data structures by name/description

Navigation via a simple top nav bar linking to all three pages.

---

## Project Structure

```
RefData/
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS config
│   │   ├── models.py            # Pydantic request/response models
│   │   ├── database.py          # MongoDB connection (motor async driver)
│   │   └── routers/
│   │       ├── structures.py    # Structure CRUD endpoints
│   │       └── elements.py      # Element CRUD endpoints
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx              # Router setup
│   │   ├── main.jsx             # Entry point
│   │   ├── api/
│   │   │   └── client.js        # Axios API wrapper
│   │   ├── components/
│   │   │   └── Navbar.jsx       # Top navigation
│   │   └── pages/
│   │       ├── AddStructure.jsx
│   │       ├── SearchElements.jsx
│   │       └── SearchStructures.jsx
│   ├── package.json
│   └── vite.config.js
├── CLAUDE.md
├── README.md
└── .gitignore
```

---

## Implementation Steps

### Step 1: Backend setup
- Create `backend/` directory with `requirements.txt` (fastapi, uvicorn, motor, pydantic)
- `database.py` — MongoDB async connection via motor
- `models.py` — Pydantic models for structures and elements
- `main.py` — FastAPI app with CORS middleware

### Step 2: Backend API routes
- `routers/structures.py` — CRUD for reference data structures
- `routers/elements.py` — CRUD for elements within structures

### Step 3: Frontend setup
- Scaffold Vite + React project in `frontend/`
- Install dependencies: react-router-dom, axios
- Configure Vite proxy to forward `/api` requests to FastAPI (port 8000)

### Step 4: Frontend pages
- `Navbar.jsx` — Navigation links
- `AddStructure.jsx` — Form with dynamic field builder + element entry
- `SearchStructures.jsx` — Search bar + results list of structures
- `SearchElements.jsx` — Structure selector dropdown + search within elements

### Step 5: Update project files
- Update `.gitignore` for Python/Node artifacts
- Update `CLAUDE.md` with build/run commands
- Update `README.md`

---

## Verification
1. **Backend:** Start with `uvicorn app.main:app --reload` from `backend/`, verify API docs at `http://localhost:8000/docs`
2. **Frontend:** Start with `npm run dev` from `frontend/`, verify pages load and connect to API
3. **End-to-end:** Create a structure via the form, add elements, search for them
