"""Standalone script to run the RetrieveActionCodes batch job.

Usage:
    cd backend && python -m scripts.run_retrieve_action_codes
"""

import asyncio
import sys

from app.jobs.retrieve_action_codes import retrieve_action_codes


async def main():
    print("Starting RetrieveActionCodes job...")
    result = await retrieve_action_codes()
    print(f"Done. Deleted {result['deleted_count']} old rows, "
          f"inserted {result['inserted_count']} rows "
          f"from {result['csv_filename']}.")
    return result


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except Exception as e:
        print(f"Job failed: {e}", file=sys.stderr)
        sys.exit(1)
