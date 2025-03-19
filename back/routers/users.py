from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.users import Users
from schemas.users import UsersCreate, UsersOut

router = APIRouter()

@router.get("/", response_model=List[UsersOut])
async def get_users(db: Session = Depends(get_db)):
    """
    Récupère la liste de tous les utilisateurs.
    """
    users = db.query(Users).all()
    return users

@router.post("/", response_model=UsersOut)
async def create_user(users: UsersCreate, db: Session = Depends(get_db)):
    """
    Crée un nouvel utilisateur.
    """
    db_users = Users(pseudo=users.pseudo, u_password=users.u_password)
    db.add(db_users)
    db.commit()
    db.refresh(db_users)
    return db_users
