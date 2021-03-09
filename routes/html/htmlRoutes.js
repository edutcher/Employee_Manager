const express = require('express');
const router = express.Router();

router.get("/", (req, res) => {
    let pageTitle = 'Home';
    res.render('index', { pageTitle });
});

router.get("/employees", (req, res) => {
    let pageTitle = 'Employees';
    res.render('employees', { pageTitle });
});

router.get("/departments", (req, res) => {
    let pageTitle = 'Departments';
    res.render('departments', { pageTitle });
});

module.exports = router;