from logging import log
from dotenv import load_dotenv
import requests
import os
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

TMDB_AUTH = os.getenv("TMDB_AUTH")

URL = "https://api.themoviedb.org/3/movie/"

HEADERS = {
    "accept": "application/json",
    "Authorization": TMDB_AUTH
}

def get_recommandation(movie_id: int, page: int = 1):
    url = f"{URL}{movie_id}/recommendations?language=fr-FR&page={page}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()


def get_similar(movie_id: int, page: int = 1):
    url = f"{URL}{movie_id}/similar?language=fr-FR&page={page}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()

def get_popular(page: int = 1):
    url = f"{URL}/popular?language=fr-FR&page={page}"
    response = requests.get(url, headers=HEADERS)
    response.raise_for_status()
    return response.json()
