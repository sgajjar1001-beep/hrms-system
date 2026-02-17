
const express = require('express');
const router = express.Router();
const db = require('../config/db');

router.post('/assign', (req, res) => {
    db.query("INSERT INTO apron_assignments SET ?", req.body, (err) => {
        if (err) throw err;
        res.json({ message: "Apron Assigned" });
    });
});

router.post('/wash', (req, res) => {
    db.query("INSERT INTO apron_wash_logs SET ?", req.body, (err) => {
        if (err) throw err;
        res.json({ message: "Wash Entry Saved" });
    });
});

router.get('/pending', (req, res) => {
    db.query("SELECT * FROM apron_wash_logs WHERE returned = false", (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

module.exports = router;
