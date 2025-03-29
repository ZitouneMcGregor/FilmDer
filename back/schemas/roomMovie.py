from typing import List
from pydantic import BaseModel

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