from sqlalchemy import Column, Integer, String
from database import Base

class Users(Base):
    __tablename__ = "Users"
    
    id = Column(Integer, primary_key=True, index=True)
    pseudo = Column(String(50), nullable=False)
    u_password = Column(String(255), nullable=False)
