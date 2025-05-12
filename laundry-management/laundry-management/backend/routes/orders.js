const express = require('express');
const router = express.Router();
const db = require('../db'); // your MySQL connection
const crypto = require('crypto');

// Generate unique IDs
const generateId = (prefix = '', length = 6) =>
  prefix + crypto.randomBytes(length).toString('hex').slice(0, length).toUpperCase();

// POST /api/order
router.post('/', (req, res) => {
  const { name, address, contact, service_id } = req.body;

  // Validation
  if (!name || !address || !contact || !service_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const customer_id = generateId('CUST_');
  const order_id = generateId('ORD_');

  // Step 1: Insert customer
  const insertCustomer = `INSERT INTO customers (customer_id, name, address, contact)
                          VALUES (?, ?, ?, ?)`;
  db.query(insertCustomer, [customer_id, name, address, contact], (err) => {
    if (err) {
      console.error('Customer insert failed:', err);
      return res.status(500).json({ error: 'Customer insert failed', details: err.message });
    }

    // Step 2: Get service price
    const serviceQuery = `SELECT price FROM services WHERE service_id = ?`;
    db.query(serviceQuery, [service_id], (err, serviceResults) => {
      if (err || serviceResults.length === 0) {
        console.error('Service lookup failed:', err);
        return res.status(404).json({ error: 'Service not found' });
      }

      const total_amount = serviceResults[0].price;

      // Step 3: Pick random employee
      const empQuery = `SELECT employee_id FROM employees`;
      db.query(empQuery, (err, empResults) => {
        if (err || empResults.length === 0) {
          console.error('No employee available:', err);
          return res.status(500).json({ error: 'No employee found' });
        }

        const randomEmp = empResults[Math.floor(Math.random() * empResults.length)].employee_id;

        // Step 4: Insert order
        const insertOrder = `INSERT INTO orders (order_id, customer_id, service_id, total_amount, order_date, status, employee_id)
                             VALUES (?, ?, ?, ?, NOW(), 'Pending', ?)`;

        db.query(insertOrder, [order_id, customer_id, service_id, total_amount, randomEmp], (err) => {
          if (err) {
            console.error('Order insert failed:', err);
            return res.status(500).json({ error: 'Order insert failed', details: err.message });
          }

          res.json({ message: 'Order placed successfully', order_id, total_amount });
        });
      });
    });
  });
});

module.exports = router;
