from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models.room import Room
from models.userRoom import UserRoom
from models.users import Users
from schemas.room import RoomOut
from schemas.users import UsersCreate, UsersOut, UsersUpdate
from schemas.userMovie import *
from models.userMovie import UserMovie

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

#############
# UserMovie #
#############

@router.get("/{user_id}/movies", response_model=List[UserMovieOut])
async def get_user_movies(user_id: int, db: Session = Depends(get_db)):
    user_movies = db.query(UserMovie).filter(UserMovie.user_id == user_id).all()
    return user_movies

@router.post("/{user_id}/movies", response_model=UserMovieOut)
async def create_user_movie(user_id: int, movie: UserMovieCreate, db: Session = Depends(get_db)):
    if movie.user_id != user_id:
        raise HTTPException(status_code=400, detail="user_id mismatch between URL and payload")
    
    db_movie = UserMovie(
        user_id=user_id,
        movie_id=movie.movie_id,
        movie_img=movie.movie_img,
        movie_rating=movie.movie_rating,
        movie_name=movie.movie_name
    )
    db.add(db_movie)
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.put("/{user_id}/movies/{movie_id}", response_model=UserMovieOut)
async def update_user_movie(user_id: int, movie_id: int, movie_update: UserMovieUpdate, db: Session = Depends(get_db)):
    db_movie = db.query(UserMovie).filter(UserMovie.id == movie_id, UserMovie.user_id == user_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db_movie.movie_img = movie_update.movie_img
    db_movie.movie_rating = movie_update.movie_rating
    db_movie.movie_name = movie_update.movie_name
    
    db.commit()
    db.refresh(db_movie)
    return db_movie

@router.delete("/{user_id}/movies/{movie_id}", response_model=UserMovieOut)
async def delete_user_movie(user_id: int, movie_id: int, db: Session = Depends(get_db)):
    db_movie = db.query(UserMovie).filter(UserMovie.id == movie_id, UserMovie.user_id == user_id).first()
    if not db_movie:
        raise HTTPException(status_code=404, detail="Movie not found")
    
    db.delete(db_movie)
    db.commit()
    return db_movie

@router.get("/{user_id}/rooms", response_model=List[RoomOut])
async def get_rooms(user_id: int, db: Session = Depends(get_db)):
    """
    Récupère la liste de toutes les rooms
    """
    rooms = db.query(Room).join(UserRoom, Room.id == UserRoom.room_id).filter(UserRoom.user_id == user_id, Room.close == 0).all()
    return rooms

