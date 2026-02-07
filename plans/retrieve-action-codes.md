# Plan: RetrieveActionCodes Batch Job

## Context
The ActionCodes structure already exists in `ref_structures` with 10 string fields. We need a Python batch job that downloads Massachusetts court offense code data from a state government ZIP file, extracts the CSV, and loads all rows into the `ref_elements` collection linked to the ActionCodes structure. The job must be available both as a standalone CLI script and as an API endpoint.

## Files to Create

### 1. `backend/app/jobs/__init__.py`
Empty package init.

### 2. `backend/app/jobs/retrieve_action_codes.py` — Core logic
Async function `retrieve_action_codes()` that:

1. **Look up ActionCodes structure** in `structures_collection` by name to get its `_id`
2. **Download ZIP** from `https://www.mass.gov/doc/masscourts-offense-code-information/download` using `httpx.AsyncClient(follow_redirects=True, timeout=60.0)`
3. **Only on successful download**, delete all `ref_elements` where `structure_id` matches (preserves data if download fails)
4. **Extract ZIP** in memory via `zipfile.ZipFile(io.BytesIO(zip_bytes))`
5. **Find CSV** whose filename starts with `actncd` (case-insensitive)
6. **Parse CSV** — read header row for column names (used as keys, not inserted as data), then build one document per data row:
   ```python
   {
       "structure_id": ObjectId(structure_id),
       "values": {"RUNDATE": "...", "STATUTE_NBR": "...", ...},
       "created_at": now,
       "updated_at": now,
   }
   ```
   This matches the existing pattern in `elements.py:42-51`.
7. **Bulk insert** in batches of 1000 via `elements_collection.insert_many()`
8. **Return** summary dict: `status`, `structure_id`, `csv_filename`, `deleted_count`, `inserted_count`

Imports reuse: `app.database.elements_collection`, `app.database.structures_collection`, `bson.ObjectId`

### 3. `backend/app/routers/jobs.py` — API endpoint
- `POST /api/jobs/retrieve-action-codes` — calls `retrieve_action_codes()`, returns summary JSON
- Catches `RuntimeError` and generic exceptions, returns HTTP 500 with detail message
- Follows existing router pattern (APIRouter with tags)

### 4. `backend/scripts/run_retrieve_action_codes.py` — Standalone script
- Adds `backend/` to `sys.path` so `app` package is importable
- Calls `asyncio.run(main())` where `main()` invokes `retrieve_action_codes()` and logs results
- Exits with code 1 on failure (for cron compatibility)
- Usage: `cd backend && python -m scripts.run_retrieve_action_codes`

## Files to Modify

### 5. `backend/app/main.py`
Add import and register the jobs router:
```python
from app.routers import jobs
app.include_router(jobs.router, prefix="/api")
```

### 6. `backend/requirements.txt`
Add `httpx` for async HTTP downloads.

## Error Handling
- Download failure → existing data untouched (delete only happens after successful download)
- Structure not found → `RuntimeError` with descriptive message
- No matching CSV in ZIP → `RuntimeError`
- Blank CSV rows → silently skipped
- Job is fully idempotent — re-running deletes and reloads cleanly

## Verification
1. Start backend: `cd backend && source .venv/bin/activate && uvicorn app.main:app --reload`
2. Run via API: `curl -X POST http://localhost:8000/api/jobs/retrieve-action-codes`
3. Run via script: `cd backend && python -m scripts.run_retrieve_action_codes`
4. Verify data: `GET /api/structures/{actioncodes_id}/elements` should return loaded rows
5. Run again to confirm idempotency (same count after second run)
