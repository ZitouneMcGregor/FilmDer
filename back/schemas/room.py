from pydantic import BaseModel
from typing import Optional

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
