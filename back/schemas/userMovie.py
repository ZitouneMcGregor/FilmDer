from pydantic import BaseModel

class UserMovieBase(BaseModel):
    user_id: int
    movie_id: int
    movie_img: str
    movie_rating: float
    movie_name: str

class UserMovieCreate(UserMovieBase):
    pass

class UserMovieUpdate(BaseModel):
    movie_img: str
    movie_rating: int
    movie_name: str

class UserMovieOut(UserMovieBase):
    id: int

    class Config:
        orm_mode = True
