import requests

URL = "https://api.themoviedb.org/3/movie/"

HEADERS = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJmN2UzNzY5M2EwNmQ1ZTk5MWY4MTJlZGJhNzdhYzcyYiIsIm5iZiI6MTc0MjgzNzExMC41MTQsInN1YiI6IjY3ZTE5NTc2MTZhM2M1YzIyNGYwM2RkMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BT3LMCxAC_6ToLwdkC0Zklf1KJnSY4LBSAFov0mYdk0"
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