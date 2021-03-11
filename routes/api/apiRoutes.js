const { json } = require('express');
const express = require('express');
const empDB = require('../../lib/empDB');
const router = express.Router();

let DB = new empDB;

router.get("/employees", async(req, res) => {
    let peeps = await DB.findAllEmployees();
    res.json(peeps);
})

router.get("/roles", async(req, res) => {
    let roles = await DB.findAllRoles();
    res.json(roles);
})

router.get("/departments", async(req, res) => {
    let dpts = await DB.findAllDepartments();
    res.json(dpts);
})

router.get("/employee/:id", async(req, res) => {
    let { id } = req.params;
    let peep = await DB.findEmployeeById(id);
    res.json(peep);
})

router.post("/employee/search", async(req, res) => {
    let search = req.body;
    let peep = await DB.searchEmployee(search);
    res.json(peep);
})

router.get("/department/:id", async(req, res) => {
    let { id } = req.params;
    let people = await DB.findEmpsByDepartment(id);
    res.json(people);
})

router.post("/employee", async(req, res) => {
    let newEmp = req.body;
    let peep = await DB.addEmployee(newEmp);
    res.json(peep);
})

module.exports = router;