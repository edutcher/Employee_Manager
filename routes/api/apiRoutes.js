const { json } = require('express');
const express = require('express');
const empDB = require('../../lib/empDB');
const router = express.Router();

let DB = new empDB;

router.get("/employees", async(req, res) => {
    try {
        let employees = await DB.findAllEmployees();
        res.status(200).json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.get("/roles", async(req, res) => {
    try {
        let roles = await DB.findAllRoles();
        res.status(200).json(roles);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.get("/departments", async(req, res) => {
    try {
        let depts = await DB.findAllDepartments();
        res.status(200).json(depts);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.get("/employee/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let employee = await DB.findEmployeeById(id);
        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.get("/employees/managers/:id", async(req, res) => {
    try {
        let { id } = req.params;
        if (id === undefined) res.status(400);
        let employees = await DB.findManagersByDepartment(id);
        res.status(200).json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }

})

router.post("/employee/search", async(req, res) => {
    try {
        let search = req.body;
        let employee = await DB.searchEmployee(search);
        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.get("/department/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let employees = await DB.findEmpsByDepartment(id);
        res.status(200).json(employees);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.post("/employee", async(req, res) => {
    try {
        let newEmp = req.body;
        let employee = await DB.addEmployee(newEmp);
        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.put("/employee/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let updatedEmp = req.body;
        let employee = await DB.updateEmployee(id, updatedEmp);
        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.delete("/employee/:id", async(req, res) => {
    try {
        let { id } = req.params;
        console.log(id);
        let employee = await DB.deleteEmployee(id);
        res.status(200).json(employee);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.delete("/role/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let role = await DB.deleteEmployee(id);
        res.status(200).json(role);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

router.delete("/department/:id", async(req, res) => {
    try {
        let { id } = req.params;
        let dept = await DB.deleteEmployee(id);
        res.status(200).json(dept);
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
})

module.exports = router;