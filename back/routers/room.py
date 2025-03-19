import random
from typing import List
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

class Movie(BaseModel):
    id: int
    name: str


@router.get("/")
async def get_rooms(db: Session = Depends(get_db)):
    return {"message": "Liste des salles"}

@router.post("/")
async def create_room(room: dict, db: Session = Depends(get_db)):
    return {"message": "Salle créée", "room": room}

@router.get("/movies", response_model=List[Movie])
def get_movies():
    movies = [
    {"id": 1, "name": "Inception"},
    {"id": 2, "name": "Interstellar"},
    {"id": 3, "name": "The Matrix"},
    {"id": 4, "name": "The Dark Knight"},
    {"id": 5, "name": "Pulp Fiction"},
]

    return movies
