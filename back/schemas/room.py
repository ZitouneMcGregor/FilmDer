from pydantic import BaseModel
from typing import Optional

class RoomBase(BaseModel):

    nb_player: int
    nb_film: int
    name: str


class RoomCreate(RoomBase):
    pass

class RoomJoin(BaseModel):
    join_code: str
    class Config:
        from_attributes = True


class RoomOut(RoomBase):
    id: int
    id_admin: int
    join_code: str
    close: int
    ready: int

    class Config:
        from_attributes = True
