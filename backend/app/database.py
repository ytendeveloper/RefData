import os

from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "refdata")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

structures_collection = db["ref_structures"]
elements_collection = db["ref_elements"]
