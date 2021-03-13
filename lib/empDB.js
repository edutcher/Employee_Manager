const mysql = require('mysql');
require('dotenv').config();

var connection;

function handleDisconnect() {
    connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: process.env.DB_NAME
    })
    connection.connect(function(err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function(err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

class empDB {
    async findAllEmployees() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM ((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        })
    }
    async findEmployeeById(id) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM ((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id WHERE e.id=${id}`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        })
    }
    async searchEmployee({ firstName, lastName }) {
        let query = '';
        if (firstName) {
            query = 'SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM ((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id WHERE e.first_name='${firstName}'`;
            if (lastName) query += ` AND e.last_name='${lastName}'`
        } else if (lastName) {
            query = 'SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM ((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id WHERE e.last_name='${lastName}'`
        } else return;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        })
    }
    async findEmpsByDepartment(departmentId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM ((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id WHERE department.id=${departmentId}`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async findManagersByDepartment(departmentId) {
        return new Promise((resolve, reject) => {
            connection.query('SELECT e.id, e.first_name, e.last_name, role.title, role.salary, department.name, CONCAT (m.first_name, " " , m.last_name)' +
                ` AS manager FROM (((employee e LEFT JOIN employee m on e.manager_id=m.id) INNER JOIN role ON e.role_id=role.id)` +
                ` INNER JOIN department ON role.department_id=department.id) WHERE department.id=${departmentId} AND e.is_manager=TRUE`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async findAllRoles() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM role', (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
    async findAllDepartments() {
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM department', (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
    async addEmployee(newEmp) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO employee (first_name, last_name, is_manager, role_id, manager_id)' +
                ` VALUE ('${newEmp.firstName}', '${newEmp.lastName}', ${newEmp.isManager}, ${newEmp.roleId}, ${newEmp.managerId})`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async addRole(newRole) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO role (title, salary, department_id)' +
                ` VALUE ('${newRole.title}', ${newRole.salary}, ${newRole.departmentId})`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async addDepartment(department) {
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO department (name)' +
                ` VALUE ('${department}')`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async updateEmployee(empID, { firstName, lastName, isManager, roleId, managerId }) {
        if (!firstName && !lastName && !isManager && !roleId && !managerId) return;
        let qArray = [];
        let query = `UPDATE employee SET (`;
        if (firstName) qArray.push(`first_name=${firstName}`);
        if (lastName) qArray.push(`last_name=${lastName}`);
        if (isManager) qArray.push(`is_manager=${isManager}`);
        if (roleId) qArray.push(`role_id=${roleId}`);
        if (managerId) qArray.push(`manager_id=${managerId}`);
        let tempQ = qArray.join(', ');
        query += tempQ;
        query += `) WHERE id=${empID}`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
}

handleDisconnect();

module.exports = empDB;