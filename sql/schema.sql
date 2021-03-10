CREATE TABLE employee (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
first_name VARCHAR(30),
last_name VARCHAR(30),
is_manager BOOLEAN,
role_id INT,
FOREIGN KEY (role_id) REFERENCES role(id),
manager_id INT,
FOREIGN KEY (manager_id) REFERENCES employee(id) );

CREATE TABLE role (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
salary DECIMAL,
department_id INT,
FOREIGN KEY (department_id) REFERENCES department(id) );

CREATE TABLE department (
id INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
title VARCHAR(30),
 );