from datetime import date

from pydantic import BaseModel, Field


class RFQCreate(BaseModel):
    product_name: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10)
    quantity: int = Field(gt=0)
    delivery_location: str = Field(min_length=2, max_length=200)
    deadline: date


class RFQUpdate(BaseModel):
    product_name: str = Field(min_length=2, max_length=200)
    description: str = Field(min_length=10)
    quantity: int = Field(gt=0)
    delivery_location: str = Field(min_length=2, max_length=200)
    deadline: date