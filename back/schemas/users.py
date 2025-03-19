from pydantic import BaseModel

class UsersBase(BaseModel):
    pseudo: str

class UsersCreate(UsersBase):
    u_password: str

class UsersOut(UsersBase):
    id: int

    class Config:
        orm_mode = True
