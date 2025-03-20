from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base

class UserMovie(Base):
    __tablename__ = "UserMovie"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("Users.id"), nullable=False)
    movie_id = Column(Integer, nullable=False)
    movie_img = Column(String(255))
    movie_rating = Column(Integer)
    movie_name = Column(String(255))
