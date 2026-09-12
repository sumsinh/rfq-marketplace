from sqlalchemy import Column, Integer, String, Text, Date, ForeignKey
from app.database.database import Base


class RFQ(Base):
    __tablename__ = "rfqs"

    id = Column(Integer, primary_key=True, index=True)
    buyer_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    product_name = Column(String, nullable=False)
    description = Column(Text, nullable=False)
    quantity = Column(Integer, nullable=False)
    delivery_location = Column(String, nullable=False)
    deadline = Column(Date, nullable=False)

    status = Column(String, default="open", nullable=False)