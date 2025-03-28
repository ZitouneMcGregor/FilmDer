from typing import Optional
from pydantic import BaseModel

class UsersBase(BaseModel):
    pseudo: str

class UsersCreate(UsersBase):
    u_password: str
    profile_picture: Optional[str] = None

class UsersUpdate(BaseModel):
    pseudo: str = None
    u_password: str = None
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class UsersOut(UsersBase):
    id: int
    profile_picture: Optional[str] = None

    class Config:
        from_attributes = True

class UserId(BaseModel):
    id: int