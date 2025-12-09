from fastapi import APIRouter, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import procedure_api # <--- Chỉ import cái này

app = FastAPI(title="BK-LMS Procedure Based")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(procedure_api.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "System running on Stored Procedures"}