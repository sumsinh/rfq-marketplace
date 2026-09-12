from pydantic import BaseModel, Field


class QuotationCreate(BaseModel):
    rfq_id: int
    quoted_price: float = Field(gt=0)
    estimated_delivery_time: int = Field(gt=0)
    message: str | None = Field(default=None, max_length=1000)