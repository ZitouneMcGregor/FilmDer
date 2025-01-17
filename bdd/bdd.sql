CREATE DATABASE IF NOT EXISTS FilmDerDataBase;


USE FilmDerDataBase;

CREATE TABLE IF NOT EXISTS Utilisateur (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    Utilisateurname VARCHAR(50) NOT NULL,    
    password VARCHAR(255) NOT NULL    
);

CREATE TABLE IF NOT EXISTS Room(
    id INT AUTO_INCREMENT PRIMARY KEY
);



CREATE TABLE IF NOT EXISTS UtilisateurRoom(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Utilisateur_id INT NOT NULL,
    room_id INT NOT NULL,
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (room_id) REFERENCES Room(id)
);

CREATE TABLE IF NOT EXISTS Movie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    adult BOOLEAN NOT NULL,
    banniere VARCHAR(255) NOT NULL,
    titre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    note FLOAT NOT NULL

);


CREATE TABLE IF NOT EXISTS Genre(
    id INT PRIMARY KEY,
    genre VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS MovieGenre(
    id INT AUTO_INCREMENT PRIMARY KEY,
    movie_id INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (movie_id) REFERENCES Movie(id),
    FOREIGN KEY (genre_id) REFERENCES Genre(id)
);

CREATE TABLE IF NOT EXISTS RoomMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES Room(id),
    FOREIGN KEY (movie_id) REFERENCES Movie(id)
);

CREATE TABLE IF NOT EXISTS UtilisateurMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Utilisateur_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (movie_id) REFERENCES Movie(id)
);


CREATE TABLE IF NOT EXISTS Result(
    id INT AUTO_INCREMENT PRIMARY KEY,
    res VARCHAR(50) NOT NULL,
    Utilisateur_id INT NOT NULL,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (room_id) REFERENCES Room(id),
    FOREIGN KEY (movie_id) REFERENCES Movie(id)
);

INSERT INTO Genre (id, genre) VALUES
(28, 'Action'),
(12, 'Aventure'),
(16, 'Animation'),
(35, 'Comédie'),
(80, 'Crime'),
(99, 'Documentaire'),
(18, 'Drame'),
(10751, 'Familial'),
(14, 'Fantastique'),
(36, 'Histoire'),
(27, 'Horreur'),
(10402, 'Musique'),
(9648, 'Mystère'),
(10749, 'Romance'),
(878, 'Science-Fiction'),
(10770, 'Téléfilm'),
(53, 'Thriller'),
(10752, 'Guerre'),
(37, 'Western');



INSERT INTO Movie (adult, banniere, titre, description, date, note) VALUES
(false, 'https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg', 'Inception', 'Un voleur qui s’immisce dans les rêves des autres pour y voler des secrets.', '2010-07-16', 8.8),
(false, 'https://image.tmdb.org/t/p/original/6bCplVkhowCjTHXWv49UjRPn0eK.jpg', 'The Dark Knight', 'Batman affronte le Joker dans une lutte pour Gotham City.', '2008-07-18', 9.0),
(false, 'https://image.tmdb.org/t/p/original/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg', 'Interstellar', 'Un groupe d’astronautes voyage dans un trou noir pour sauver l’humanité.', '2014-11-07', 8.6),
(false, 'https://image.tmdb.org/t/p/original/vZiqhw6oFoMlHSneIdVip9lVwAm.jpg', 'Avengers: Endgame', 'Les Avengers tentent de restaurer l’univers après le claquement de Thanos.', '2019-04-26', 8.4),
(false, 'https://image.tmdb.org/t/p/original/djMOotHwgn2zQsP8vI4QY7CZpjs.jpg', 'Parasite', 'Une famille pauvre s’infiltre dans une famille riche, mais les choses tournent mal.', '2019-05-30', 8.6),
(false, 'https://image.tmdb.org/t/p/original/uexxR7Kw1qYbZk0RYaF9Rx5ykbj.jpg', 'Joker', 'Arthur Fleck devient le célèbre Joker après une série d’événements tragiques.', '2019-10-04', 8.4),
(false, 'https://image.tmdb.org/t/p/original/w0AiO7H8DeO8dwYJ6e8H8f7ONlo.jpg', 'The Lion King', 'Simba doit accepter son destin et reprendre sa place en tant que roi.', '1994-06-24', 8.5),
(false, 'https://image.tmdb.org/t/p/original/1Ahvixxi1HfCbs21z5pGiIl1ESx.jpg', 'Pulp Fiction', 'Un mélange d’histoires criminelles entrelacées à Los Angeles.', '1994-10-14', 8.9),
(false, 'https://image.tmdb.org/t/p/original/yhbNGG8tFvOxFveRt59SFD3m5rf.jpg', 'Forrest Gump', 'Un homme simple d’esprit traverse les événements marquants de l’histoire américaine.', '1994-07-06', 8.8),
(false, 'https://image.tmdb.org/t/p/original/ef2O4z8Ofv8TyveB9ofKZn8z8TB.jpg', 'The Shawshank Redemption', 'Deux hommes développent une amitié en prison tout en cherchant à s’échapper.', '1994-09-23', 9.3);


INSERT INTO MovieGenre (movie_id, genre_id) VALUES
(1, 878),  -- Inception: Science-Fiction
(1, 53),   -- Inception: Thriller
(2, 28),   -- The Dark Knight: Action
(2, 80),   -- The Dark Knight: Crime
(2, 53),   -- The Dark Knight: Thriller
(3, 878),  -- Interstellar: Science-Fiction
(3, 12),   -- Interstellar: Aventure
(4, 28),   -- Avengers: Endgame: Action
(4, 12),   -- Avengers: Endgame: Aventure
(5, 18),   -- Parasite: Drame
(5, 53),   -- Parasite: Thriller
(6, 18),   -- Joker: Drame
(6, 80),   -- Joker: Crime
(7, 16),   -- The Lion King: Animation
(7, 10751),-- The Lion King: Familial
(8, 80),   -- Pulp Fiction: Crime
(8, 35),   -- Pulp Fiction: Comédie
(9, 18),   -- Forrest Gump: Drame
(10, 18);  -- The Shawshank Redemption: Drame
