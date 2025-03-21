import random
from typing import List
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room
from models.userRoom import UserRoom
from schemas.room import RoomOut, RoomCreate
from schemas.userRoom import UserRoomCreate, UserRoomOut, UserRoomNumber

from utils.room import get_unique_join_code

logging.basicConfig(level=logging.INFO)
router = APIRouter()

class Movie(BaseModel):
    id: int
    name: str


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
@router.post("/", response_model=RoomOut)
async def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle room
    """
    db_room = Room(id_admin=room.id_admin,nb_player=room.nb_player,nb_film=room.nb_film, name=room.name, join_code=get_unique_join_code(db))
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    return db_room



@router.post("/{room_id}/users", response_model=UserRoomOut)
async def create_userRoom(room_id: int,userRoom: UserRoomCreate, db: Session = Depends(get_db)):
    """
    Join room
    """
    db_room = db.query(Room).filter(Room.id == room_id).first()

    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    nb_player = db.query(UserRoom).filter(UserRoom.room_id == room_id).count()

    if nb_player + 1 > db_room.nb_player:
        raise HTTPException(status_code=409, detail="Room is full")

    db_userRoom = db.query(UserRoom).filter(UserRoom.user_id == userRoom.user_id, UserRoom.room_id == room_id ).first()

    if db_userRoom is not None:
        raise HTTPException(status_code=409, detail="UserRoom existe")

    db_userRoom = UserRoom(user_id = userRoom.user_id, room_id =room_id)
    db.add(db_userRoom)
    db.commit()
    db.refresh(db_userRoom)
    return db_userRoom

@router.get("/join/{join_code}", response_model=RoomOut)
async def get_room_by_join_code(join_code: str, db: Session = Depends(get_db)):
    """
    Récupère une room grâce à son join_code.
    """
    room = db.query(Room).filter(Room.join_code == join_code).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return room


@router.delete("{room_id}/users/{user_id}")
async def leave_room(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """L'utilisateur quitte une room"""
    db_userRoom = db.query(UserRoom).filter(UserRoom.user_id == user_id, UserRoom.room_id == room_id).first()
    if not db_userRoom:
        raise HTTPException(status_code=404, detail="Invalid user or room")

    db.delete(db_userRoom)
    db.commit()
    return {"Deleted": True}


@router.put("{room_id}/start", response_model=RoomOut)
async def start_room(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """
    Démarre une room si l'utilisateur est admin.
    """
    room = db.query(Room).filter(Room.id == room_id).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.id_admin != user_id:
        raise HTTPException(status_code=403, detail="Seul l'admin peut démarrer la room.")

    room.ready = 1
    db.commit()
    db.refresh(room)

    return room


@router.post("/{room_id}/stop", response_model=RoomOut)
async def start_room(user_id: int, room_id: int, db: Session = Depends(get_db)):
    """
    start la room
    """

    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.id_admin != user_id:
        raise HTTPException(status_code=403, detail="Tu n'es pas admin mon coco :)")

    room.close = 1
    db.commit()
    db.refresh(room)

    return room

@router.get("/{room_id}/players", response_model=UserRoomNumber)
async def get_room_players(room_id: int, db: Session = Depends(get_db)):
    """
    Récupérer le nombre de joueur de la room
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    nb_players = db.query(UserRoom).filter(UserRoom.room_id == room_id).count()


    return UserRoomNumber(room_id = room_id, nb_players= nb_players)
