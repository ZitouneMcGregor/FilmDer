import logging

from sqlalchemy.orm import Session
from sqlalchemy import select
from collections import Counter

from Algo_Recommandation.api_tmdb import get_recommandation
from models.userMovie import UserMovie
from models.userRoom import UserRoom

log = logging.getLogger("uvicorn")

def algo_recommandation_film(room_id:int, db: Session, nb_film: int = 10):
    user = select(UserRoom.user_id).where(UserRoom.room_id == room_id)

    movies = db.query(UserMovie.movie_id, UserMovie.movie_rating).filter(
    UserMovie.user_id.in_(user)
    ).all()

    seen_movies = set(movie_id for movie_id, _ in movies)
    liked_movies = set(movie_id for movie_id, rating in movies if rating > 6)

    recommand_movies = []

    for liked_movie in liked_movies:
       recos = get_recommandation(liked_movie).get('results', [])
       for reco in recos:
           reco_id = reco['id']
           if reco_id not in seen_movies:
               recommand_movies.append(reco_id)


    res = Counter(recommand_movies).most_common(nb_film)

    log.info(f"Recommandation film: {res}")

    return [id for id, _ in res]






