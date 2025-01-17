import requests


url = "https://api.themoviedb.org/3/discover/movie?sort_by=release_date.desc&page=1"

headers = {
    "accept": "application/json",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5YWUxYzlmMWRhY2M4N2I2ODM5ZDVmM2JkNDAyMWNmOCIsIm5iZiI6MTczNzExMDkxMy40NDMsInN1YiI6IjY3OGEzNTgxYTY0ZmViMTZjOTFkODAzYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.agY9-kxH2JN2MtEsVH_9oUQLSvBu1u76ZkJFM9B_7zU"
}

response = requests.get(url, headers=headers)

print(response.text)