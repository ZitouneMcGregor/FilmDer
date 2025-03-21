from fastapi import FastAPI
from routers import users, room

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(room.router, prefix="/rooms", tags=["room"])

