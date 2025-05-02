const express = require('express');
const router = express.Router();
const db = require('../db');

// Add new customer
router.post('/', (req, res) => {
  const { name, address, contact } = req.body;
  const query = 'INSERT INTO customers (name, address, contact) VALUES (?, ?, ?)';
  db.query(query, [name, address, contact], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Customer added', customer_id: result.insertId });
  });
});

// Get all customers
router.get('/', (req, res) => {
  db.query('SELECT * FROM customers', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json(results);
  });
});

module.exports = router;
