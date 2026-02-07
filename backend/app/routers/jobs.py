from fastapi import APIRouter, HTTPException

from app.jobs.retrieve_action_codes import retrieve_action_codes

router = APIRouter(tags=["jobs"])


@router.post("/jobs/retrieve-action-codes")
async def run_retrieve_action_codes():
    try:
        result = await retrieve_action_codes()
        return result
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {e}")
