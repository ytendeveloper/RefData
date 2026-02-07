from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

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
