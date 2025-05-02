const express = require('express');
const router = express.Router();
const db = require('../db');

// Create new order
router.post('/', (req, res) => {
  const { customer_id, service_id } = req.body;
  db.query('SELECT price FROM services WHERE service_id = ?', [service_id], (err, serviceRes) => {
    if (err) return res.status(500).json({ error: err.message });
    if (serviceRes.length === 0) return res.status(404).json({ error: 'Service not found' });

    const total_amount = serviceRes[0].price;
    db.query(
      'INSERT INTO orders (customer_id, service_id, total_amount, status) VALUES (?, ?, ?, ?)',
      [customer_id, service_id, total_amount, 'Pending'],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ order_id: result.insertId, total_amount });
      }
    );
  });
});

// Get order status
router.get('/:order_id', (req, res) => {
  const { order_id } = req.params;
  db.query(
    'SELECT * FROM orders WHERE order_id = ?',
    [order_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(result[0]);
    }
  );
});

module.exports = router;
