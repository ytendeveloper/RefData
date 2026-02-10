from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from app.routers import elements, jobs, structures

app = FastAPI(title="RefData API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(structures.router, prefix="/api")
app.include_router(elements.router, prefix="/api")
app.include_router(jobs.router, prefix="/api")


@app.get("/api/health")
async def health():
    return JSONResponse({"status": "ok"})


# --- Serve built frontend in production ---
STATIC_DIR = Path(__file__).resolve().parent.parent / "static"

if STATIC_DIR.is_dir():
    app.mount("/assets", StaticFiles(directory=STATIC_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}")
    async def spa_fallback(full_path: str):
        return FileResponse(STATIC_DIR / "index.html")
