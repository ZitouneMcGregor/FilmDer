from fastapi import FastAPI
from routers import users, room, tmdb

app = FastAPI()

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(room.router, prefix="/room", tags=["room"])
app.include_router(tmdb.router, prefix="/tmdb", tags=["tmdb"])

