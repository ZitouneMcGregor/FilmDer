from sqlalchemy import Column, Integer, ForeignKey
from database import Base

class UserRoom(Base):
    __tablename__ = "UserRoom"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer,ForeignKey("Users.id"), nullable=False)
    room_id = Column(Integer,ForeignKey("Room.id"), nullable=False)
    index_film = Column(Integer, nullable=False, default=0)
