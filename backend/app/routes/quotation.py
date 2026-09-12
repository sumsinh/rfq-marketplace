from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user
from app.models.quotation import Quotation
from app.models.rfq import RFQ
from app.schemas.quotation import QuotationCreate
from app.models.user import User

router = APIRouter(
    prefix="/quotations",
    tags=["Quotations"]
)



@router.post("/")
def create_quotation(
    quotation_data: QuotationCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    if str(current_user["role"]).lower() != "supplier":
        raise HTTPException(
            status_code=403,
            detail="Only suppliers can submit quotations"
        )

  
    rfq = db.query(RFQ).filter(
        RFQ.id == quotation_data.rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

 
    if rfq.status != "open":
        raise HTTPException(
            status_code=400,
            detail="This RFQ is no longer accepting quotations"
        )

   
    existing_quotation = db.query(Quotation).filter(
        Quotation.rfq_id == quotation_data.rfq_id,
        Quotation.supplier_id == current_user["user_id"]
    ).first()

    if existing_quotation:
        raise HTTPException(
            status_code=400,
            detail="You have already submitted a quotation for this RFQ"
        )

    
    new_quotation = Quotation(
        rfq_id=quotation_data.rfq_id,
        supplier_id=current_user["user_id"],
        quoted_price=quotation_data.quoted_price,
        estimated_delivery_time=quotation_data.estimated_delivery_time,
        message=quotation_data.message
    )

    db.add(new_quotation)
    db.commit()
    db.refresh(new_quotation)

    return {
        "message": "Quotation submitted successfully",
        "quotation": {
            "id": new_quotation.id,
            "rfq_id": new_quotation.rfq_id,
            "supplier_id": new_quotation.supplier_id,
            "quoted_price": float(new_quotation.quoted_price),
            "estimated_delivery_time": new_quotation.estimated_delivery_time,
            "message": new_quotation.message
        }
    }


@router.get("/my")
def get_my_quotations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if str(current_user["role"]).lower() != "supplier":
        raise HTTPException(
            status_code=403,
            detail="Only suppliers can view their quotations"
        )

    quotations = db.query(Quotation).filter(
        Quotation.supplier_id == current_user["user_id"]
    ).order_by(Quotation.id.desc()).all()

    return {
        "quotations": [
            {
                "id": quotation.id,
                "rfq_id": quotation.rfq_id,
                "supplier_id": quotation.supplier_id,
                "quoted_price": float(quotation.quoted_price),
                "estimated_delivery_time": quotation.estimated_delivery_time,
                "message": quotation.message
            }
            for quotation in quotations
        ]
    }

@router.get("/received")
def get_received_quotations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view received quotations"
        )

    buyer_rfqs = db.query(RFQ).filter(
        RFQ.buyer_id == current_user["user_id"]
    ).all()

    rfq_ids = [rfq.id for rfq in buyer_rfqs]

    if not rfq_ids:
        return {
            "quotations": [],
            "total": 0
        }

    quotations = db.query(Quotation).filter(
        Quotation.rfq_id.in_(rfq_ids)
    ).order_by(Quotation.id.desc()).all()

    return {
        "quotations": [
            {
                "id": quotation.id,
                "rfq_id": quotation.rfq_id,
                "supplier_id": quotation.supplier_id,
                "quoted_price": float(quotation.quoted_price),
                "estimated_delivery_time": quotation.estimated_delivery_time,
                "message": quotation.message
            }
            for quotation in quotations
        ],
        "total": len(quotations)
    }

@router.get("/rfq/{rfq_id}")
def get_rfq_quotations(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view received quotations"
        )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    if rfq.buyer_id != current_user["user_id"]:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view quotations for this RFQ"
        )

    quotations = db.query(Quotation).filter(
    Quotation.rfq_id == rfq_id
).order_by(Quotation.id.desc()).all()

    return {
    "quotations": [
        {
            "id": quotation.id,
            "rfq_id": quotation.rfq_id,
            "supplier_id": quotation.supplier_id,
            "supplier_name": db.query(User).filter(
                User.id == quotation.supplier_id
            ).first().name,
            "supplier_email": db.query(User).filter(
                User.id == quotation.supplier_id
            ).first().email,
            "quoted_price": float(quotation.quoted_price),
            "estimated_delivery_time": quotation.estimated_delivery_time,
            "message": quotation.message
        }
        for quotation in quotations
    ]
}