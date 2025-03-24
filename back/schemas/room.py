from pydantic import BaseModel
from typing import List, Optional

class RoomBase(BaseModel):

    nb_player: int
    nb_film: int
    name: str


class RoomCreate(RoomBase):
    id_admin: int
    pass


class RoomOut(RoomBase):
    id: int
    id_admin: int
    join_code: str
    close: int
    ready: int

    class Config:
        from_attributes = True

class RoomMovieCreate(BaseModel):
    movie_ids: List[int]

class RoomMovieOut(BaseModel):
    id: int
    room_id: int
    movie_id: int
    movie_index: int
    nb_likes: int

    class Config:
        from_attributes = True

class MovieSchema(BaseModel):
    id: int
    title: str
    director: str
    release_year: int

    class Config:
        from_attributes = True

class RoomMovieVote(BaseModel):
    userId: int
    movieId: int
    vote: int 