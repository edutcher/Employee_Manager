const mysql = require('mysql');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PW,
    database: process.env.DB_NAME
})

class empDB {
    async findAllEmployees() {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM employee', (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        })
    }
    async findEmployeeById(id) {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM employee WHERE id=${id}`, (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        })
    }
    async searchEmployee(firstName, lastName = null) {
        let stop = await connection.connect((err) => {});
        let query = '';
        if (firstName) {
            query = `SELECT * FROM employee WHERE first_name=${firstName}`;
            if (lastName) query += ` AND last_name=${lastName}`
        } else if (lastName) {
            query = `SELECT * FROM employee WHERE last_name=${lastName}`
        } else return 'No Name';
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        })
    }
    async findEmpsByDepartment(departmentId) {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('SELECT employee.first_name, employee.last_name, role.title, department.name FROM ((employee' +
                ` INNER JOIN role ON employee.role_id=role.id) INNER JOIN department ON role.department_id=department.id)` +
                ` WHERE department.id=${departmentId}`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async findAllRoles() {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM role', (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
    async findAllDepartments() {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('SELECT * FROM department', (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
    async addEmployee(newEmp) {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO employee (first_name, last_name, is_manager, role_id, manager_id)' +
                ` VALUE (${newEmp.firstName}, ${newEmp.lastName}, ${newEmp.isManager}, ${newEmp.roleId}, ${newEmp.managerId})`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async addRole(newRole) {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO role (title, salary, department_id)' +
                ` VALUE (${newRole.title}, ${newRole.salary}, ${newRole.departmentId})`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async addDepartment(department) {
        let stop = await connection.connect((err) => {});
        return new Promise((resolve, reject) => {
            connection.query('INSERT INTO department (name)' +
                ` VALUE (${department})`, (err, res) => {
                    return err ? reject(err) : resolve(res);
                })
        });
    }
    async updateEmployee(empID, firstName, lastName, isManager, roleId, managerId = null) {
        if (!firstName && !lastName && !isManager && !roleId && !managerId) return;
        let stop = await connection.connect((err) => {});
        let qArray = [];
        let query = `UPDATE employee SET (`;
        if (firstName) qArray.push(firstName);
        if (lastName) qArray.push(lasstName);
        if (isManager) qArray.push(isManager);
        if (roleId) qArray.push(roleId);
        if (managerId) qArray.push(managerId);
        let tempQ = qArray.join(', ');
        query += qArray;
        query += `) WHERE id=${empID}`;
        return new Promise((resolve, reject) => {
            connection.query(query, (err, res) => {
                return err ? reject(err) : resolve(res);
            })
        });
    }
}

module.exports = empDB;