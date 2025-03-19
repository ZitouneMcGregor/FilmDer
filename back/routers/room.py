from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

@router.get("/")
async def get_rooms(db: Session = Depends(get_db)):
    return {"message": "Liste des salles"}

@router.post("/")
async def create_room(room: dict, db: Session = Depends(get_db)):
    return {"message": "Salle créée", "room": room}
