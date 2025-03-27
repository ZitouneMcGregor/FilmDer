from sqlalchemy import Column, Integer, String, ForeignKey, Float
from database import Base

class RoomMovie(Base):
    __tablename__ = "RoomMovie"

    id = Column(Integer, primary_key=True, index=True)
    room_id = Column(Integer, ForeignKey("Room.id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    movie_index = Column(Integer, nullable=False, default=0)
    nb_likes = Column(Integer, nullable=False,  default=0)