import logging

from fastapi import HTTPException
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.room import Room
from models.userRoom import UserRoom
from schemas.room import RoomOut, RoomCreate
from schemas.userRoom import UserRoomCreate, UserRoomOut

from utils.room import get_unique_join_code

logging.basicConfig(level=logging.INFO)
router = APIRouter()

@router.post("/}", response_model=RoomOut)
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
async def create_userRoom(userRoom: UserRoomCreate, db: Session = Depends(get_db)):
    """
    Join room
    """
    db_room = db.query(Room).filter(room_id = userRoom.room_id).first()

    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    nb_player = db.query(UserRoom).filter(UserRoom.room_id == userRoom.room_id).count()

    if nb_player + 1 > userRoom.nb_player:
        raise HTTPException(status_code=409, detail="Room is full")

    db_userRoom = db.query(UserRoom).filter(user_id = userRoom.user_id, room_id = userRoom.room_id ).first()

    if db_userRoom is not None:
        raise HTTPException(status_code=409, detail="UserRoom existe")

    db_userRoom = UserRoom(user_id = userRoom.user_id, room_id =userRoom.room_id)
    db.add(db_userRoom)
    db.commit()
    db.refresh(db_userRoom)
    return db_userRoom

@router.get("join/{join_code}", response_model=RoomOut)
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