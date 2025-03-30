from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import os

from database import get_db
from models.room import Room
from models.userRoom import UserRoom
from models.users import Users
from schemas.room import RoomOut
from schemas.users import UsersCreate, UsersOut, UsersUpdate
from schemas.userMovie import *
from models.userMovie import UserMovie
import logging

router = APIRouter()

# Dossier contenant les photos existantes
UPLOAD_DIR = os.path.abspath("uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@router.get("/photos", response_model=List[str])
async def get_available_photos():
    logger.debug(f"Accès au dossier : {UPLOAD_DIR}")
    try:
        files = os.listdir(UPLOAD_DIR)
        logger.debug(f"Fichiers trouvés : {files}")
        # Renvoyer juste le nom du fichier, laissant au client le soin d'ajouter /uploads/ si nécessaire
        photos = [f for f in files if os.path.isfile(os.path.join(UPLOAD_DIR, f))]
        logger.debug(f"Photos renvoyées : {photos}")
        return photos  # Ex. ["photo1.jpg", "photo2.jpg", ...]
    except Exception as e:
        logger.error(f"Erreur dans get_available_photos : {e}")
        raise
        
@router.get("/", response_model=List[UsersOut])
async def get_users(db: Session = Depends(get_db)):
    """
    Récupère la liste de tous les utilisateurs.
    """
    users = db.query(Users).all()
    return users

@router.post("/", response_model=UsersOut)
async def create_user(users: UsersCreate, db: Session = Depends(get_db)):
    existing_user = db.query(Users).filter(Users.pseudo == users.pseudo).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Le pseudo est déjà pris.")
    
    db_users = Users(pseudo=users.pseudo, u_password=users.u_password, profile_picture=users.profile_picture)
    if users.profile_picture and not os.path.exists(os.path.join(UPLOAD_DIR, users.profile_picture.lstrip('/uploads/'))):
        raise HTTPException(status_code=400, detail="La photo spécifiée n'existe pas sur le serveur.")
    
    db.add(db_users)
    db.commit()
    db.refresh(db_users)
    return db_users

@router.put("/{user_id}", response_model=UsersOut)
async def update_user(user_id: int, users_update: UsersUpdate, db: Session = Depends(get_db)):
    db_users = db.query(Users).filter(Users.id == user_id).first()
    if not db_users:
        raise HTTPException(status_code=404, detail="User not found")
    
    if users_update.pseudo is not None:
        db_users.pseudo = users_update.pseudo
    if users_update.u_password is not None:
        db_users.u_password = users_update.u_password
    if users_update.profile_picture is not None:
        filename = users_update.profile_picture.split('/')[-1]  # Extract 'photo2.jpg'
        check_path = os.path.join(UPLOAD_DIR, filename)
        logger.debug(f"Raw profile_picture: '{users_update.profile_picture}'")
        logger.debug(f"Checking file existence at: {check_path}")
        logger.debug(f"Absolute path: {os.path.abspath(check_path)}")
        logger.debug(f"File exists: {os.path.exists(check_path)}")
        if not os.path.exists(check_path):
            raise HTTPException(status_code=400, detail="La photo spécifiée n'existe pas sur le serveur.")
        db_users.profile_picture = users_update.profile_picture
    
    db.commit()
    db.refresh(db_users)
    return db_users

@router.get("/{user_id}", response_model=UsersOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    db_user = db.query(Users).filter(Users.id == user_id).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user


@router.get("/check/")
async def check_user(pseudo: str, u_password: str, db: Session = Depends(get_db)):
    """
    Vérifie si un utilisateur existe avec le pseudo et mot de passe fournis.
    Retourne un message de confirmation ou une erreur.
    """
    user = db.query(Users).filter(
        Users.pseudo == pseudo,
        Users.u_password == u_password
    ).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur non trouvé ou identifiants incorrects")
    
    return user
  
  
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
    
    existing_movie = db.query(UserMovie).filter(
        UserMovie.user_id == user_id,
        UserMovie.movie_id == movie.movie_id
    ).first()
    
    if existing_movie:
        raise HTTPException(status_code=400, detail="Ce film est déjà dans la liste de l'utilisateur")
    
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
    rooms = db.query(Room).join(UserRoom, Room.id == UserRoom.room_id).filter(UserRoom.user_id == user_id, Room.close == 0).all()
    return rooms

@router.get("/{user_id}/rooms/histo", response_model=List[RoomOut])
async def get_rooms_histo(user_id: int, db: Session = Depends(get_db)):
    rooms = db.query(Room).join(UserRoom, Room.id == UserRoom.room_id).filter(UserRoom.user_id == user_id, Room.close == 1).all()
    return rooms


