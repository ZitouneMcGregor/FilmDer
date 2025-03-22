from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class Room(Base):
    __tablename__ = "Room"
    id = Column(Integer, primary_key=True, index=True)
    id_admin = Column(Integer,ForeignKey("Users.id"), nullable=False)
    nb_player = Column(Integer, nullable=False)
    nb_film = Column(Integer, nullable=False)
    join_code = Column(String(255), nullable=False, unique=True)
    name = Column(String(255), nullable=False)
    close = Column(Integer, nullable=False, default=0)
    ready = Column(Integer, nullable=False, default=0)

class RoomMovie(Base):
    __tablename__ = "RoomMovie"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("Room.id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    movie_index = Column(Integer, nullable=False)
    nb_likes = Column(Integer, default=0)

