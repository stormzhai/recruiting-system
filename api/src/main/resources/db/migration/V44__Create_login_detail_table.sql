CREATE TABLE loginDetail (
    id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    token VARCHAR (32) NOT NULL,
    loginDate INT NOT NULL,
    logoutDate INT,
    flag INT NOT NULL
);
