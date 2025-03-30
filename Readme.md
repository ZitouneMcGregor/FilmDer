# Filmder Application

Filmder est une application web full-stack permettant de gérer des parties de visionnage de films, de voter et d'obtenir des recommandations de films. L’application est entièrement dockerisée pour simplifier son déploiement.

---

## Notre équipe

- CARRERE-GEE Olivier
- MOUNIC Clément
- LIOGER--BUN Jérémi
- BENZEROUAL Omar

---

## Table des matières

- [Architecture](#architecture)
- [Installation et Lancement](#installation-et-lancement)
- [Algorithme de Recommandation](#algorithme-de-recommandation)

---

## Architecture

L’application se compose de plusieurs parties :
- **Backend** : Un serveur d’API qui gère la logique métier, notamment la gestion des votes, des rooms et le calcul des recommandations.
- **Frontend** : Une application web en Angular qui permet aux utilisateurs de rejoindre des rooms, voter pour des films et démarrer les parties.
- **Base de Données MySQL** : Pour stocker les données relationnelles (users, rooms, votes…).
- **Base de Données MongoDB** : Pour stocker des données NoSQL, éventuellement utilisées pour la gestion des logs ou d’autres informations.

---

## Installation et Lancement

L’application est entièrement dockerisée à l’aide de Docker Compose. Assurez-vous d’avoir Docker et Docker Compose installés sur votre machine.

### Pré-requis
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Instructions

1. **Cloner le dépôt**

   ```bash
   git clone https://votre-url-depot.git
   cd filmder
   ```
   
2. **Lancer les containers**

Utilisez la commande suivante pour démarrer tous les services :

   ```bash
   docker-compose up --build
   ```
Cela va lancer les services back, frontend, mysql et mongo.

---

## Algorithme de Recommandation

L’algorithme de recommandation est conçu pour proposer des films en se basant sur les préférences des utilisateurs présents dans une room. Voici les grandes étapes de l’algorithme :

**1) Récupération du Nombre Minimal de Films Likés**

L’algorithme commence par déterminer le nombre minimum de films likés (note supérieure à 6) parmi tous les utilisateurs d’une room. Cela garantit une recommandation équitable pour tous les utilisateurs.


**2) Utilisation des Films Populaires**

Si aucun utilisateur n’a liké de film (min_film == 0), l’algorithme récupère les films populaires en itérant sur les pages des résultats de l’API TMDB jusqu’à obtenir le nombre requis de films recommandés.


**3) Collecte des Films Likés par les Utilisateurs**

Pour chaque utilisateur de la room, l’algorithme récupère les films dont la note dépasse 6 et les stocke dans une collection. Pour assurer l’équité, il sélectionne pour chaque utilisateur un nombre aléatoire de films correspondant au nombre minimum de films likés par un utilisateur.


**4) Récupération des Recommandations depuis TMDB**

Pour chaque film liké, l’algorithme interroge l’API TMDB pour récupérer des recommandations. Il ajoute les films recommandés à la liste, en évitant ceux déjà vus par les utilisateurs.


**4) Tri par Fréquence**

Enfin, l’algorithme trie les films recommandés en fonction de leur fréquence d’apparition. Si le nombre de films recommandés est insuffisant, il complète avec ceux déjà vus mais fortement recommandés.


Cet algorithme assure que la sélection finale de films est équilibrée, en tenant compte des préférences individuelles et en introduisant une part de nouveauté grâce aux recommandations de TMDB.

