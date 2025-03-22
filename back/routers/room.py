import random
from typing import List
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room, RoomMovie
from models.userRoom import UserRoom
from schemas.room import MovieSchema, RoomMovieCreate, RoomMovieOut, RoomOut, RoomCreate, RoomJoin
from nanoid import generate
logging.basicConfig(level=logging.INFO)
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

@router.get("/{room_id}/movies", response_model=List[RoomMovieOut])
async def get_movies(room_id: int, db: Session = Depends(get_db)):
    """
    Récupère les films associés à une salle (RoomMovie).
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room_movies = db.query(RoomMovie).filter(RoomMovie.room_id == room_id).all()

    if not room_movies:
        raise HTTPException(status_code=404, detail="No movies found for this room")

    return room_movies

@router.get("/{user_id}", response_model=List[RoomOut])
async def get_rooms(user_id: int, db: Session = Depends(get_db)):
    """
    Récupère la liste de toutes les rooms
    """
    rooms = db.query(Room).join(UserRoom, Room.id == UserRoom.room_id).filter(UserRoom.user_id == user_id, Room.close == 0).all()
    return rooms

@router.post("/{user_id}", response_model=RoomOut)
async def create_room(user_id: int,room: RoomCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle room
    """
    db_room = Room(id_admin=user_id,nb_player=room.nb_player,nb_film=room.nb_film, name=room.name, join_code=get_unique_join_code(db))
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    db_userRoom = UserRoom(user_id = db_room.id_admin, room_id = db_room.id)
    db.add(db_userRoom)
    db.commit()
    db.refresh(db_userRoom)

    return db_room

@router.post("/{user_id}/join", response_model=RoomOut)
async def create_room(user_id: int, code: RoomJoin, db: Session = Depends(get_db)):
    """
    Join la room grace au code
    """
    room = db.query(Room).filter(Room.join_code == code.join_code).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    nb_player = db.query(UserRoom).filter(UserRoom.room_id == room.id).count()

    logging.info(f"nb_player: {nb_player}")

    if nb_player + 1  > room.nb_player:
        raise HTTPException(status_code=409, detail="Je n'existe pas ou plus dommage pour toi :----)")
    elif nb_player + 1 == room.nb_player:
        room.ready =1
        db.commit()
        db.refresh(room)
    db_userRoom = UserRoom(user_id = user_id, room_id = room.id)
    db.add(db_userRoom)
    db.commit()
    db.refresh(db_userRoom)
    return room

movies = [
    {"id": 1, "name": "Inception"},
    {"id": 2, "name": "Interstellar"},
    {"id": 3, "name": "The Matrix"},
    {"id": 4, "name": "The Dark Knight"},
    {"id": 5, "name": "Pulp Fiction"},
]


def generate_join_code(length: int = 6) -> str:
    """
    Génère un code aléatoire en utilisant nanoid.
    """
    alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    return generate(alphabet, length)

def get_unique_join_code(db: Session, length: int = 6) -> str:
    """
    Génère un code de join unique en vérifiant dans la base de données.
    """
    while True:
        code = generate_join_code(length)
        if not db.query(Room).filter(Room.join_code == code).first():
            return code

@router.post("/{room_id}/movies", response_model=List[RoomMovieOut])
async def add_movies_to_room(room_id: int, room_movie: RoomMovieCreate, db: Session = Depends(get_db)):
    """
    Ajoute des films à une salle (RoomMovie).
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    max_movie_index = db.query(RoomMovie).filter(RoomMovie.room_id == room_id).count()

    added_movies = []
    for idx, movie_id in enumerate(room_movie.movie_ids, start=max_movie_index + 1):
        db_movie = RoomMovie(room_id=room_id, movie_id=movie_id, movie_index=idx, nb_likes=0)
        db.add(db_movie)
        db.commit()
        db.refresh(db_movie)
        added_movies.append(db_movie)

    return added_movies