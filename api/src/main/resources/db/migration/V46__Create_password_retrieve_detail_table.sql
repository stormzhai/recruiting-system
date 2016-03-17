CREATE TABLE passwordRetrieveDetail (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR (100) NOT NULL UNIQUE ,
    token VARCHAR (32),
    retrieveDate BIGINT
);
