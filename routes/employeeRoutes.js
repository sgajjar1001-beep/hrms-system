
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.get('/', (req, res) => {
    db.query("SELECT * FROM employees", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

router.post('/', (req, res) => {
    db.query("INSERT INTO employees SET ?", req.body, (err) => {
        if (err) throw err;
        res.json({ message: "Employee Added" });
    });
});

module.exports = router;
