
const express = require('express');
const router = express.Router();
const db = require('../db');
const crypto = require('crypto');

// Helper to generate a unique customer ID
const generateCustomerId = () => 'CUST_' + crypto.randomBytes(4).toString('hex').toUpperCase();

// Add new customer with generated customer_id
router.post('/', (req, res) => {
  const { name, address, contact } = req.body;
  if (!name || !address || !contact) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const customer_id = generateCustomerId();
  const query = 'INSERT INTO customers (customer_id, name, address, contact) VALUES (?, ?, ?, ?)';
  db.query(query, [customer_id, name, address, contact], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(200).json({ message: 'Customer added', customer_id });
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
