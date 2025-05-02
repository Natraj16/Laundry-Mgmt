const express = require('express');
const router = express.Router();
const db = require('../db');

// Get employee assigned to an order (via service_id)
router.get('/:order_id', (req, res) => {
  const { order_id } = req.params;

  const query = `
    SELECT e.employee_id, e.name, e.contact
    FROM orders o
    JOIN employees e ON o.service_id = e.service_id
    WHERE o.order_id = ?
    LIMIT 1
  `;

  db.query(query, [order_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'No employee found' });
    res.json(result[0]);
  });
});

module.exports = router;
