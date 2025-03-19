from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.users import Users
from schemas.users import UsersCreate, UsersOut, UsersUpdate

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

@router.put("/{user_id}", response_model=UsersOut)
async def update_user(user_id: int, users_update: UsersUpdate, db: Session = Depends(get_db)):
    db_users = db.query(Users).filter(Users.id == user_id).first()
    if not db_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_users.pseudo = users_update.pseudo
    db_users.u_password = users_update.u_password
    
    db.commit()
    db.refresh(db_users)
    return db_users
