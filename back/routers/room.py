import logging

from fastapi import HTTPException
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room
from models.userRoom import UserRoom
from schemas.room import RoomOut, RoomCreate, RoomJoin
from nanoid import generate
logging.basicConfig(level=logging.INFO)
router = APIRouter()

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