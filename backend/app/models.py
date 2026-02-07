from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class FieldDefinition(BaseModel):
    name: str
    type: str = "string"
    required: bool = False


class StructureCreate(BaseModel):
    name: str
    description: str = ""
    fields: list[FieldDefinition]


class StructureResponse(BaseModel):
    id: str
    name: str
    description: str
    fields: list[FieldDefinition]
    created_at: datetime
    updated_at: datetime


class ElementCreate(BaseModel):
    values: dict[str, Any]


class ElementBulkCreate(BaseModel):
    elements: list[ElementCreate]


class ElementResponse(BaseModel):
    id: str
    structure_id: str
    values: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class PaginatedElements(BaseModel):
    items: list[ElementResponse]
    total: int
    skip: int
    limit: int
