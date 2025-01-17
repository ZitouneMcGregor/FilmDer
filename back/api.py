from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel
from typing import List
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

# Database configuration
DATABASE_URL = "mysql+pymysql://user:1234567aA*@localhost/FilmDerDataBase"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# User table definition
class Utilisateur(Base):
    __tablename__ = "Utilisateur"

    id = Column(Integer, primary_key=True, index=True)
    Utilisateurname = Column(String(50), nullable=False, unique=True)
    password = Column(String(255), nullable=False)

# Create tables in the database
Base.metadata.create_all(bind=engine)

# Pydantic model for API
class UserCreate(BaseModel):
    Utilisateurname: str
    password: str

class UserRead(BaseModel):
    id: int
    Utilisateurname: str

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI()

# Dependency to get a session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/users/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(Utilisateur).filter(Utilisateur.Utilisateurname == user.Utilisateurname).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = Utilisateur(Utilisateurname=user.Utilisateurname, password=user.password)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.get("/users/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.put("/users/{user_id}", response_model=UserRead)
def update_user(user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.Utilisateurname = updated_user.Utilisateurname
    user.password = updated_user.password
    db.commit()
    db.refresh(user)
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(Utilisateur).filter(Utilisateur.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()
    return {"detail": "User deleted successfully"}
