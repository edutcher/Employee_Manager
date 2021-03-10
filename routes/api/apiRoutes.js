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

router.get("/department/:id", async(req, res) => {
    let { id } = req.params;
    let people = await DB.findEmployeesByDepartment(id);
    res.json(people);
})

module.exports = router;