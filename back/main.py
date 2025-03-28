from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import time
from datetime import datetime
from typing import Dict
from motor.motor_asyncio import AsyncIOMotorClient
from routers import users, room
from dotenv import load_dotenv
import os
from pathlib import Path
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse


env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)


MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME")
MONGO_LOGS_COLLECTION = os.getenv("MONGO_LOGS_COLLECTION")

UPLOAD_DIR = Path("./uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

app = FastAPI()

app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

mongo_client = AsyncIOMotorClient(MONGO_URI)
mongo_db = mongo_client[MONGO_DB_NAME]
logs_collection = mongo_db[MONGO_LOGS_COLLECTION]

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    # Appel du prochain middleware ou route
    response = await call_next(request)
    
    process_time = time.time() - start_time
    
    # Données de journalisation
    log_data: Dict[str, any] = {
        "timestamp": datetime.utcnow().isoformat(),
        "path": request.url.path,
        "method": request.method,
        "status_code": response.status_code,
        "process_time": round(process_time, 4),
        "client_ip": request.client.host,
    }
    
    # Vérification si la requête est pour un fichier statique
    if request.url.path.startswith("/uploads"):
        log_data["endpoint"] = "static_file"  # Un nom personnalisé pour les fichiers statiques
    else:
        # Si ce n'est pas un fichier statique, on récupère le nom de l'endpoint (si disponible)
        endpoint = request.scope.get("endpoint")
        if endpoint:
            log_data["endpoint"] = endpoint.__name__

    # Enregistrer les logs dans la base de données
    await logs_collection.insert_one(log_data)
    
    return response

app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(room.router, prefix="/rooms", tags=["room"])