from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from Algo_Recommandation.algo import algo_recommandation_film
from database import get_db
from models.room import Room
from models.roomMovie import RoomMovie
from models.userRoom import UserRoom
from schemas.room import RoomMovieCreate, RoomMovieOut, RoomMovieVote, RoomOut, RoomCreate
from schemas.userRoom import UserRoomCreate, UserRoomOut, UserRoomNumber
from schemas.users import UserId
from utils.room import get_unique_join_code

router = APIRouter()

@router.get("/{room_id}/movies", response_model=List[RoomMovieOut])
async def get_movies(room_id: int, db: Session = Depends(get_db)):
    """
    Récupère les films associés à une salle (RoomMovie).
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")
    room_movies = db.query(RoomMovie).filter(RoomMovie.room_id == room_id).all()

    if not room_movies:
        raise HTTPException(status_code=404, detail="No movies found for this room")

    return room_movies

@router.get("/{user_id}", response_model=List[RoomOut])
async def get_rooms(user_id: int, db: Session = Depends(get_db)):
    """
    Récupère la liste de toutes les rooms
    """
    rooms = db.query(Room).join(UserRoom, Room.id == UserRoom.room_id).filter(UserRoom.user_id == user_id, Room.close == 0).all()
    return rooms


@router.post("/", response_model=RoomOut)
async def create_room(room: RoomCreate, db: Session = Depends(get_db)):
    """
    Crée une nouvelle room
    """
    db_room = Room(id_admin=room.id_admin,nb_player=room.nb_player,nb_film=room.nb_film, name=room.name, join_code=get_unique_join_code(db))
    db.add(db_room)
    db.commit()
    db.refresh(db_room)

    return db_room



@router.post("/{room_id}/users", response_model=UserRoomOut)
async def create_userRoom(room_id: int,userRoom: UserRoomCreate, db: Session = Depends(get_db)):
    """
    Join room
    """
    db_room = db.query(Room).filter(Room.id == room_id).first()

    if db_room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    nb_player = db.query(UserRoom).filter(UserRoom.room_id == room_id).count()

    if nb_player + 1 > db_room.nb_player:
        raise HTTPException(status_code=409, detail="Room is full")

    db_userRoom = db.query(UserRoom).filter(UserRoom.user_id == userRoom.user_id, UserRoom.room_id == room_id ).first()

    if db_userRoom is not None:
        raise HTTPException(status_code=409, detail="UserRoom existe")

    db_userRoom = UserRoom(user_id = userRoom.user_id, room_id =room_id)
    db.add(db_userRoom)
    db.commit()
    db.refresh(db_userRoom)
    return db_userRoom

@router.get("/join/{join_code}", response_model=RoomOut)
async def get_room_by_join_code(join_code: str, db: Session = Depends(get_db)):
    """
    Récupère une room grâce à son join_code.
    """
    room = db.query(Room).filter(Room.join_code == join_code).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    return room


@router.delete("/{room_id}/users/{user_id}")
async def leave_room(room_id: int, user_id: int, db: Session = Depends(get_db)):
    """L'utilisateur quitte une room"""
    db_userRoom = db.query(UserRoom).filter(UserRoom.user_id == user_id, UserRoom.room_id == room_id).first()
    if not db_userRoom:
        raise HTTPException(status_code=404, detail="Invalid user or room")

    db.delete(db_userRoom)
    db.commit()
    return {"Deleted": True}


@router.put("/{room_id}/start", response_model=RoomOut)
async def start_room(room_id: int, user_id: UserId, db: Session = Depends(get_db)):
    """
    Démarre une room si l'utilisateur est admin.
    """
    room = db.query(Room).filter(Room.id == room_id).first()

    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")

    if room.id_admin != user_id.id:
        raise HTTPException(status_code=403, detail="Seul l'admin peut démarrer la room.")

    #try:
    algo_films = algo_recommandation_film(room_id, db, room.nb_film)
    for film in algo_films:
        movie_id = film['id'] if isinstance(film, dict) else film
        db.add(RoomMovie(room_id=room_id, movie_id=movie_id))

    room.ready = 1
    db.commit()
    db.refresh(room)

    return room

    #except Exception as e:
        #db.rollback()
        #raise HTTPException(status_code=500, detail=f"Erreur lors du démarrage de la room : {str(e)}")



@router.post("/{room_id}/stop", response_model=RoomOut)
async def start_room(user_id: int, room_id: int, db: Session = Depends(get_db)):
    """
    start la room
    """

    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    if room.id_admin != user_id:
        raise HTTPException(status_code=403, detail="Tu n'es pas admin mon coco :)")

    room.close = 1
    db.commit()
    db.refresh(room)

    return room

@router.get("/{room_id}/players", response_model=UserRoomNumber)
async def get_room_players(room_id: int, db: Session = Depends(get_db)):
    """
    Récupérer le nombre de joueur de la room
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if room is None:
        raise HTTPException(status_code=404, detail="Room not found")
    nb_players = db.query(UserRoom).filter(UserRoom.room_id == room_id).count()
    return UserRoomNumber(room_id = room_id, nb_players= nb_players)

@router.post("/{room_id}/movies", response_model=List[RoomMovieOut])
async def add_movies_to_room(room_id: int, room_movie: RoomMovieCreate, db: Session = Depends(get_db)):
    """
    Ajoute des films à une salle (RoomMovie).
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    max_movie_index = db.query(RoomMovie).filter(RoomMovie.room_id == room_id).count()

    added_movies = []
    for idx, movie_id in enumerate(room_movie.movie_ids, start=max_movie_index + 1):
        db_movie = RoomMovie(room_id=room_id, movie_id=movie_id, movie_index=idx, nb_likes=0)
        db.add(db_movie)
        db.commit()
        db.refresh(db_movie)
        added_movies.append(db_movie)

    return added_movies

@router.post("/{room_id}/votes")
async def vote_movies(room_id: int, votes: List[RoomMovieVote], db: Session = Depends(get_db)):
    """
    Met à jour le nombre de likes des films dans une salle en fonction des votes des utilisateurs.
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    for vote in votes:
        movie = db.query(RoomMovie).filter(RoomMovie.room_id == room_id, RoomMovie.movie_id == vote.movieId).first()
        if movie:
            if vote.vote == 1:
                movie.nb_likes += 1  
            db.commit()
            db.refresh(movie)

    return {"message": "Votes enregistrés avec succès"}

@router.get("/{room_id}",  response_model=RoomOut)
async def get_room(room_id: int, db: Session = Depends(get_db)):
    """
    Récupére une room en fonction de son id
    """
    room = db.query(Room).filter(Room.id == room_id).first()
    if not room:
        raise HTTPException(status_code=404, detail="Room not found")

    return room



