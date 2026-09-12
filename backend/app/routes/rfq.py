
from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies import get_current_user
from app.models.rfq import RFQ
from app.schemas.rfq import RFQCreate, RFQUpdate

router = APIRouter(prefix="/rfqs", tags=["RFQs"])


@router.post("/")
def create_rfq(
    rfq_data: RFQCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   
    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can create RFQs"
        )

   
    if rfq_data.deadline < date.today():
        raise HTTPException(
            status_code=400,
            detail="Deadline cannot be in the past"
        )

    new_rfq = RFQ(
        buyer_id=current_user["user_id"],
        product_name=rfq_data.product_name,
        description=rfq_data.description,
        quantity=rfq_data.quantity,
        delivery_location=rfq_data.delivery_location,
        deadline=rfq_data.deadline,
        status="open"
    )

    db.add(new_rfq)
    db.commit()
    db.refresh(new_rfq)

    return {
        "message": "RFQ created successfully",
        "rfq": {
            "id": new_rfq.id,
            "buyer_id": new_rfq.buyer_id,
            "product_name": new_rfq.product_name,
            "description": new_rfq.description,
            "quantity": new_rfq.quantity,
            "delivery_location": new_rfq.delivery_location,
            "deadline": new_rfq.deadline,
            "status": new_rfq.status
        }
    }


@router.put("/{rfq_id}")
def update_rfq(
    rfq_id: int,
    rfq_data: RFQUpdate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can update RFQs"
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
            detail="You are not allowed to update this RFQ"
        )


    if rfq.status != "open":
        raise HTTPException(
            status_code=400,
            detail="Closed RFQs cannot be edited"
        )

    
    if rfq_data.deadline < date.today():
        raise HTTPException(
            status_code=400,
            detail="Deadline cannot be in the past"
        )

    
    rfq.product_name = rfq_data.product_name
    rfq.description = rfq_data.description
    rfq.quantity = rfq_data.quantity
    rfq.delivery_location = rfq_data.delivery_location
    rfq.deadline = rfq_data.deadline

    db.commit()
    db.refresh(rfq)

    return {
        "message": "RFQ updated successfully",
        "rfq": {
            "id": rfq.id,
            "buyer_id": rfq.buyer_id,
            "product_name": rfq.product_name,
            "description": rfq.description,
            "quantity": rfq.quantity,
            "delivery_location": rfq.delivery_location,
            "deadline": rfq.deadline,
            "status": rfq.status
        }
    }

@router.get("/")
def get_available_rfqs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    
    if str(current_user["role"]).lower() != "supplier":
        raise HTTPException(
            status_code=403,
            detail="Only suppliers can browse RFQs"
        )

    rfqs = db.query(RFQ).filter(
        RFQ.status == "open"
    ).order_by(RFQ.id.desc()).all()

    return {
        "rfqs": [
            {
                "id": rfq.id,
                "product_name": rfq.product_name,
                "description": rfq.description,
                "quantity": rfq.quantity,
                "delivery_location": rfq.delivery_location,
                "deadline": rfq.deadline,
                "status": rfq.status
            }
            for rfq in rfqs
        ]
    }



@router.patch("/{rfq_id}/close")
def close_rfq(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can close RFQs"
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
            detail="You are not allowed to close this RFQ"
        )

    if rfq.status == "closed":
        raise HTTPException(
            status_code=400,
            detail="RFQ is already closed"
        )

    rfq.status = "closed"

    db.commit()
    db.refresh(rfq)

    return {
        "message": "RFQ closed successfully",
        "rfq": {
            "id": rfq.id,
            "buyer_id": rfq.buyer_id,
            "product_name": rfq.product_name,
            "description": rfq.description,
            "quantity": rfq.quantity,
            "delivery_location": rfq.delivery_location,
            "deadline": rfq.deadline,
            "status": rfq.status
        }
    }

@router.get("/my")
def get_my_rfqs(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   
    if str(current_user["role"]).lower() != "buyer":
        raise HTTPException(
            status_code=403,
            detail="Only buyers can view their RFQs"
        )

    rfqs = db.query(RFQ).filter(
        RFQ.buyer_id == current_user["user_id"]
    ).order_by(RFQ.id.desc()).all()

    return {
        "rfqs": [
            {
                "id": rfq.id,
                "product_name": rfq.product_name,
                "description": rfq.description,
                "quantity": rfq.quantity,
                "delivery_location": rfq.delivery_location,
                "deadline": rfq.deadline,
                "status": rfq.status
            }
            for rfq in rfqs
        ]
    }


@router.get("/{rfq_id}")
def get_rfq(
    rfq_id: int,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
   
    if str(current_user["role"]).lower() not in ["buyer", "supplier"]:
        raise HTTPException(
            status_code=403,
            detail="You are not allowed to view this RFQ"
        )

    rfq = db.query(RFQ).filter(
        RFQ.id == rfq_id
    ).first()

    if not rfq:
        raise HTTPException(
            status_code=404,
            detail="RFQ not found"
        )

    return {
        "rfq": {
            "id": rfq.id,
            "buyer_id": rfq.buyer_id,
            "product_name": rfq.product_name,
            "description": rfq.description,
            "quantity": rfq.quantity,
            "delivery_location": rfq.delivery_location,
            "deadline": rfq.deadline,
            "status": rfq.status
        }
    }

