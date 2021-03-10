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
        await connection.connect();
        let res = await connection.query('SELECT * FROM employee');
        connection.end();
        return res;
    }
    async findEmpsByDepartment(departmentId) {
        await connection.connect();
        let res = await connection.query('SELECT employee.first_name, employee.last_name, role.title FROM ((employee' +
            `INNER JOIN role ON employee.role_id=role.id) INNER JOIN department ON role.department_id=department.id)` +
            `WHERE department.id=${departmentId}`);
        connection.end();
        return res;
    }
    async findAllRoles() {
        await connection.connect();
        let res = await connection.query('SELECT * FROM role');
        connection.end();
        return res;
    }
    async findAllDepartments() {
        await connection.connect();
        let res = await connection.query('SELECT * FROM department');
        connection.end();
        return res;
    }
    async addEmployee(emp) {
        await connection.connect();
        let res = await connection.query('INSERT INTO employee (first_name, last_name, is_manager, role_id, manager_id)' +
            `VALUE (${emp.firstName}, ${emp.lastName}, ${emp.isManager}, ${emp.roleId}, ${emp.managerId})`);
        connection.end();
        return res;
    }
    async addRole(role) {
        await connection.connect();
        let res = await connection.query('INSERT INTO role (title, salary, department_id)' +
            `VALUE (${role.title}, ${role.salary}, ${role.departmentId})`);
        connection.end();
        return res;
    }
    async addDepartment(department) {
        await connection.connect();
        let res = await connection.query('INSERT INTO department (title)' +
            `VALUE (${department.title})`);
        connection.end();
        return res;
    }
}

module.exports = empDB;