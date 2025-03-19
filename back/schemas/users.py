from pydantic import BaseModel

class UsersBase(BaseModel):
    pseudo: str

class UsersCreate(UsersBase):
    u_password: str

class UsersUpdate(BaseModel):
    pseudo: str = None
    u_password: str = None

    class Config:
        from_attributes = True

class UsersOut(UsersBase):
    id: int

    class Config:
        from_attributes = True
