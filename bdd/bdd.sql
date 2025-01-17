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


CREATE TABLE IF NOT EXISTS RoomMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (room_id) REFERENCES Room(id),
);

CREATE TABLE IF NOT EXISTS UtilisateurMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Utilisateur_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateur(id),
);


CREATE TABLE IF NOT EXISTS Result(
    id INT AUTO_INCREMENT PRIMARY KEY,
    res VARCHAR(50) NOT NULL,
    Utilisateur_id INT NOT NULL,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (Utilisateur_id) REFERENCES Utilisateur(id),
    FOREIGN KEY (room_id) REFERENCES Room(id),
);


