from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter()

@router.get("/")
async def get_movies(db: Session = Depends(get_db)):
    return {"message": "Liste des films ou informations TMDB"}

@router.get("/{movie_id}")
async def get_movie(movie_id: int, db: Session = Depends(get_db)):
    return {"message": f"Détails du film {movie_id}"}
