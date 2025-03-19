CREATE DATABASE IF NOT EXISTS FilmDerDataBase;


USE FilmDerDataBase;

CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,  
    pseudo VARCHAR(50) NOT NULL,    
    u_password VARCHAR(255) NOT NULL    
);


CREATE TABLE IF NOT EXISTS Room(
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_admin INT NOT NULL,
    
    FOREIGN KEY (id_admin) REFERENCES Users(id)
);


CREATE TABLE IF NOT EXISTS UserRoom(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    index_film INT DEFAULT 0,
    
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (room_id) REFERENCES Room(id)
);


CREATE TABLE IF NOT EXISTS RoomMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    
    FOREIGN KEY (room_id) REFERENCES Room(id)
);


CREATE TABLE IF NOT EXISTS UserMovie(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    movie_id INT NOT NULL,
    movie_img VARCHAR(255),
    movie_rating INT,
    movie_name VARCHAR(255),
    
    FOREIGN KEY (user_id) REFERENCES Users(id)
);


CREATE TABLE IF NOT EXISTS Result(
    id INT AUTO_INCREMENT PRIMARY KEY,
    res VARCHAR(50) NOT NULL,
    user_id INT NOT NULL,
    room_id INT NOT NULL,
    movie_id INT NOT NULL,
    
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (room_id) REFERENCES Room(id)
);


