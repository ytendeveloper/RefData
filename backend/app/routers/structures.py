from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database import structures_collection
from app.models import StructureCreate, StructureResponse

router = APIRouter(tags=["structures"])


def structure_doc_to_response(doc: dict) -> StructureResponse:
    return StructureResponse(
        id=str(doc["_id"]),
        name=doc["name"],
        description=doc["description"],
        fields=doc["fields"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


@router.post("/structures", response_model=StructureResponse, status_code=201)
async def create_structure(body: StructureCreate):
    existing = await structures_collection.find_one({"name": body.name})
    if existing:
        raise HTTPException(status_code=409, detail="Structure name already exists")

    now = datetime.now(timezone.utc)
    doc = {
        "name": body.name,
        "description": body.description,
        "fields": [f.model_dump() for f in body.fields],
        "created_at": now,
        "updated_at": now,
    }
    result = await structures_collection.insert_one(doc)
    doc["_id"] = result.inserted_id
    return structure_doc_to_response(doc)


@router.get("/structures", response_model=list[StructureResponse])
async def list_structures(q: str = ""):
    query = {}
    if q:
        query = {
            "$or": [
                {"name": {"$regex": q, "$options": "i"}},
                {"description": {"$regex": q, "$options": "i"}},
            ]
        }
    cursor = structures_collection.find(query).sort("name", 1)
    results = await cursor.to_list(length=100)
    return [structure_doc_to_response(doc) for doc in results]


@router.get("/structures/{structure_id}", response_model=StructureResponse)
async def get_structure(structure_id: str):
    if not ObjectId.is_valid(structure_id):
        raise HTTPException(status_code=400, detail="Invalid ID")
    doc = await structures_collection.find_one({"_id": ObjectId(structure_id)})
    if not doc:
        raise HTTPException(status_code=404, detail="Structure not found")
    return structure_doc_to_response(doc)
