from datetime import datetime, timezone

from bson import ObjectId
from fastapi import APIRouter, HTTPException

from app.database import elements_collection, structures_collection
from app.models import ElementBulkCreate, ElementResponse, PaginatedElements

router = APIRouter(tags=["elements"])


def element_doc_to_response(doc: dict) -> ElementResponse:
    return ElementResponse(
        id=str(doc["_id"]),
        structure_id=str(doc["structure_id"]),
        values=doc["values"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


async def _get_structure(structure_id: str):
    if not ObjectId.is_valid(structure_id):
        raise HTTPException(status_code=400, detail="Invalid structure ID")
    structure = await structures_collection.find_one({"_id": ObjectId(structure_id)})
    if not structure:
        raise HTTPException(status_code=404, detail="Structure not found")
    return structure


@router.post(
    "/structures/{structure_id}/elements",
    response_model=list[ElementResponse],
    status_code=201,
)
async def add_elements(structure_id: str, body: ElementBulkCreate):
    await _get_structure(structure_id)

    items = body.elements

    now = datetime.now(timezone.utc)
    docs = []
    for item in items:
        docs.append(
            {
                "structure_id": ObjectId(structure_id),
                "values": item.values,
                "created_at": now,
                "updated_at": now,
            }
        )

    result = await elements_collection.insert_many(docs)
    for doc, inserted_id in zip(docs, result.inserted_ids):
        doc["_id"] = inserted_id

    return [element_doc_to_response(doc) for doc in docs]


@router.get(
    "/structures/{structure_id}/elements", response_model=PaginatedElements
)
async def search_elements(
    structure_id: str, q: str = "", skip: int = 0, limit: int = 50
):
    await _get_structure(structure_id)

    query: dict = {"structure_id": ObjectId(structure_id)}
    if q:
        # Search across all value fields
        query["$or"] = [
            {f"values.{key}": {"$regex": q, "$options": "i"}}
            for key in await _get_field_names(structure_id)
        ]

    total = await elements_collection.count_documents(query)
    cursor = elements_collection.find(query).sort("created_at", -1).skip(skip).limit(limit)
    results = await cursor.to_list(length=limit)
    return PaginatedElements(
        items=[element_doc_to_response(doc) for doc in results],
        total=total,
        skip=skip,
        limit=limit,
    )


async def _get_field_names(structure_id: str) -> list[str]:
    structure = await structures_collection.find_one({"_id": ObjectId(structure_id)})
    if not structure:
        return []
    return [f["name"] for f in structure.get("fields", [])]
