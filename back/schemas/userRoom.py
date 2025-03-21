from pydantic import BaseModel

class UserRoomBase(BaseModel):

    user_id: int
    room_id: int



class UserRoomCreate(UserRoomBase):
    pass

class UserRoomOut(UserRoomBase):
    id: int
    index_film: int

    class Config:
        from_attributes = True
