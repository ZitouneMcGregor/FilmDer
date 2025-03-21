from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, room

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(room.router, prefix="/room", tags=["room"])
