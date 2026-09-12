from sqlalchemy import Column, Integer, Text, ForeignKey, Numeric, UniqueConstraint

from app.database.database import Base


class Quotation(Base):
    __tablename__ = "quotations"

    id = Column(Integer, primary_key=True, index=True)

    rfq_id = Column(
        Integer,
        ForeignKey("rfqs.id"),
        nullable=False
    )

    supplier_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    quoted_price = Column(
        Numeric(12, 2),
        nullable=False
    )

    estimated_delivery_time = Column(
        Integer,
        nullable=False
    )

    message = Column(
        Text,
        nullable=True
    )

    __table_args__ = (
        UniqueConstraint(
            "rfq_id",
            "supplier_id",
            name="unique_supplier_rfq_quotation"
        ),
    )