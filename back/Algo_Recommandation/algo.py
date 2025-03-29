import logging
import random
from sqlalchemy.orm import Session
from sqlalchemy import func
from sqlalchemy import select
from collections import Counter, defaultdict

from Algo_Recommandation.api_tmdb import get_recommandation, get_popular
from models.userMovie import UserMovie
from models.userRoom import UserRoom

log = logging.getLogger("uvicorn")

def algo_recommandation_film(room_id: int, db: Session, nb_film: int = 10):

    #Liste des films que l'on vas recommander
    recommended_movies = []

    #On récupére le nombre de film de l'user avec le moins de film pour que tout les users aient le même nb de film
    min_film = get_min_movie_count(db, room_id)
    log.info(f"Le nombre minimal de films likés par un utilisateur est: {min_film}")

    page = 1
    #Si personne n'a de film on récupére juste les films populaire du momeent
    if min_film == 0:
        while len(set(recommended_movies)) < nb_film:
            reco = get_popular(page=page).get('results', [])
            for reco in reco:
                if len(set(recommended_movies)) < nb_film:
                    recommended_movies.append(reco['id'])
                elif len(set(recommended_movies)) == nb_film:
                    return recommended_movies
            page += 1

    #On récupérer les users de la room
    users_subquery = select(UserRoom.user_id).where(UserRoom.room_id == room_id)

    #On récupére leurs films
    movies = db.query(UserMovie.user_id, UserMovie.movie_id, UserMovie.movie_rating).filter(UserMovie.user_id.in_(users_subquery)).all()

    #On récupère leurs id et cela servira pour savoir si un film recommander à déjà était vue
    seen_movies = {mv.movie_id for mv in movies}

    #On récupère les films que les users on aimer soit les films avec une note supérieur à 6
    user_liked_movies = defaultdict(list)
    for mv in movies:
        if mv.movie_rating > 6:
            user_liked_movies[mv.user_id].append(mv.movie_id)

    #On définis la liste des film que l'on vas séléctionner pour notre recommandation
    selected_liked_movies = []
    #On prend pour chaque user le même nombre de film au hasard correspondant a l'user qui a le moins de film
    for movie_ids in user_liked_movies.values():
        if len(movie_ids) >= min_film:
            selected_liked_movies.extend(random.sample(movie_ids, min_film))
        else:
            selected_liked_movies.extend(movie_ids)

    liked_movies = set(selected_liked_movies)

    seen_movies_recommanded = []

    securite = False

    #Pour chaque film séléctionner on récupérer tout les films que tmdb nous recommande, tant qu'on as pas nb film on change de page
    # si jamais y'a plus de page securité nous fais sortir
    while (len(set(recommended_movies))< nb_film) or not securite:
        for liked_movie in liked_movies:
            recos = get_recommandation(liked_movie, page=page).get('results', [])

            if not recos:
                securite = True
            for reco in recos:
                reco_id = reco['id']
                if reco_id not in seen_movies:
                    log.info(f"Movie {reco['title']}∕{reco['id']}")
                    recommended_movies.append(reco_id)
                else:
                    #On recupére quand même les film recommander mais vue
                    seen_movies_recommanded.append(reco_id)

        log.info("salut")




        page += 1


    #On choisie les films en fonctions de leurs nombre d'occurence dans la liste
    counted = Counter(recommended_movies).most_common(nb_film)
    log.info(counted)

    #Si jamais y'a pas nb_film dans la liste on prend des films déjà vue mais les plus recommander pour faire plaisir
    if len(counted) < nb_film:
        diff = nb_film - len(counted)
        counted2 = Counter(seen_movies_recommanded).most_common(diff)

        counted = counted + counted2

    return [movie_id for movie_id, _ in counted]


def get_min_movie_count(db: Session, room_id: int):
    """
    Retourne le nombre minimal de films likés (rating > 6)
    parmi tous les utilisateurs de la room.
    """
    subq = (
        db.query(
            UserRoom.user_id.label("u_id"),
            func.count(UserMovie.movie_id).label("movie_count")
        )
        .join(UserMovie, UserRoom.user_id == UserMovie.user_id)
        .filter(UserRoom.room_id == room_id, UserMovie.movie_rating > 6)
        .group_by(UserRoom.user_id)
        .subquery()
    )

    min_val = db.query(func.min(subq.c.movie_count)).scalar()
    return min_val if min_val else 0
