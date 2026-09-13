from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.rfq import router as rfq_router
from app.routes.quotation import router as quotation_router

from app.database.database import Base, engine
from app.models.user import User
from app.models.rfq import RFQ
from app.models.quotation import Quotation
from app.routes.auth import router as auth_router


Base.metadata.create_all(bind=engine)


app = FastAPI(
    title="B2B RFQ Marketplace",
    description="API for a B2B Request for Quotation marketplace",
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://rfq-marketplace-five.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(rfq_router)
app.include_router(quotation_router)


@app.get("/")
def root():
    return {
        "message": "RFQ Marketplace API is running"
    }