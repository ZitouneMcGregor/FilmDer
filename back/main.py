from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, room

app = FastAPI()

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],  # Autorise Angular
    allow_credentials=True,
    allow_methods=["*"],  # Autorise toutes les méthodes HTTP
    allow_headers=["*"],  # Autorise tous les headers
)

# Inclusion des routes
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(room.router, prefix="/room", tags=["room"])
