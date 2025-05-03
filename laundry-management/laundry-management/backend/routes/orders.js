const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to generate random IDs
const generateId = (prefix = '', length = 6) =>
  prefix + Math.random().toString(36).substr(2, length).toUpperCase();

// Create new order and customer
router.post('/', (req, res) => {
  const { name, address, contact, service_id } = req.body;
  const customer_id = generateId('CUST_');
  const order_id = generateId('ORD_');

  // 1. Insert new customer
  const insertCustomerQuery = 'INSERT INTO customers (customer_id, name, address, contact) VALUES (?, ?, ?, ?)';
  db.query(insertCustomerQuery, [customer_id, name, address, contact], (err) => {
    if (err) return res.status(500).json({ error: 'Customer creation failed', details: err.message });

    // 2. Get service price
    db.query('SELECT price FROM services WHERE service_id = ?', [service_id], (err, serviceRes) => {
      if (err || serviceRes.length === 0)
        return res.status(404).json({ error: 'Service not found' });

      const total_amount = serviceRes[0].price;

      // 3. Get random employee
      db.query('SELECT employee_id FROM employees', (err, empRes) => {
        if (err || empRes.length === 0)
          return res.status(500).json({ error: 'No employees available' });

        const randomEmp = empRes[Math.floor(Math.random() * empRes.length)].employee_id;

        // 4. Insert order
        const insertOrderQuery = `
          INSERT INTO orders (order_id, customer_id, service_id, total_amount, order_date, status, employee_id)
          VALUES (?, ?, ?, ?, NOW(), 'Pending', ?)
        `;

        db.query(insertOrderQuery, [order_id, customer_id, service_id, total_amount, randomEmp], (err) => {
          if (err) return res.status(500).json({ error: 'Order creation failed', details: err.message });

          res.json({ order_id, total_amount });
        });
      });
    });
  });
});

// Track order by ID
router.get('/:order_id', (req, res) => {
  const { order_id } = req.params;
  db.query('SELECT * FROM orders WHERE order_id = ?', [order_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json(result[0]);
  });
});

module.exports = router;
