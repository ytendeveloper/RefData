import csv
import io
import zipfile
from datetime import datetime, timezone

import httpx
from bson import ObjectId

from app.database import elements_collection, structures_collection

ZIP_URL = "https://www.mass.gov/doc/masscourts-offense-code-information/download"
BATCH_SIZE = 1000


async def retrieve_action_codes() -> dict:
    """Download MA court offense codes and load into ref_elements."""

    # 1. Look up ActionCodes structure
    structure = await structures_collection.find_one({"name": "ActionCodes"})
    if not structure:
        raise RuntimeError("Structure 'ActionCodes' not found in ref_structures")
    structure_id = structure["_id"]

    # 2. Download ZIP
    async with httpx.AsyncClient(follow_redirects=True, timeout=60.0) as client:
        response = await client.get(ZIP_URL)
        response.raise_for_status()
    zip_bytes = response.content

    # 3. Delete existing elements only after successful download
    delete_result = await elements_collection.delete_many(
        {"structure_id": ObjectId(structure_id)}
    )

    # 4. Extract ZIP in memory
    with zipfile.ZipFile(io.BytesIO(zip_bytes)) as zf:
        # 5. Find CSV whose filename starts with 'actncd'
        csv_filename = None
        for name in zf.namelist():
            if name.lower().startswith("actncd") and name.lower().endswith(".csv"):
                csv_filename = name
                break
        if not csv_filename:
            raise RuntimeError(
                f"No CSV starting with 'actncd' found in ZIP. Files: {zf.namelist()}"
            )

        csv_data = zf.read(csv_filename).decode("cp1252")

    # 6. Parse CSV and build documents
    reader = csv.reader(io.StringIO(csv_data))
    headers = next(reader)  # first row = column names

    now = datetime.now(timezone.utc)
    docs = []
    inserted_count = 0

    for row in reader:
        # Skip blank rows
        if not any(cell.strip() for cell in row):
            continue

        values = {header: cell for header, cell in zip(headers, row)}
        docs.append(
            {
                "structure_id": ObjectId(structure_id),
                "values": values,
                "created_at": now,
                "updated_at": now,
            }
        )

        # 7. Bulk insert in batches
        if len(docs) >= BATCH_SIZE:
            await elements_collection.insert_many(docs)
            inserted_count += len(docs)
            docs = []

    # Insert remaining
    if docs:
        await elements_collection.insert_many(docs)
        inserted_count += len(docs)

    # 8. Return summary
    return {
        "status": "success",
        "structure_id": str(structure_id),
        "csv_filename": csv_filename,
        "deleted_count": delete_result.deleted_count,
        "inserted_count": inserted_count,
    }
