const express = require('express');
const router = express.Router();
const db = require('../db');

// Get payment status by order ID
router.post('/', (req, res) => {
  const { order_id, method } = req.body;

  // Step 1: Check if a payment already exists for this order
  db.query(
    'SELECT * FROM payments WHERE order_id = ?',
    [order_id],
    (err, paymentResult) => {
      if (err) return res.status(500).json({ error: err.message });

      if (paymentResult.length > 0) {
        return res.status(400).json({ error: 'Payment already made for this order' });
      }

      // Step 2: Get order amount
      db.query(
        'SELECT total_amount FROM orders WHERE order_id = ?',
        [order_id],
        (err, orderResult) => {
          if (err) return res.status(500).json({ error: err.message });
          if (orderResult.length === 0) return res.status(404).json({ error: 'Order not found' });

          const amount = orderResult[0].total_amount;

          // Step 3: Insert payment
          db.query(
            'INSERT INTO payments (order_id, total_amount, method, status) VALUES (?, ?, ?, ?)',
            [order_id, amount, method, 'Done'],
            (err, result) => {
              if (err) return res.status(500).json({ error: err.message });

              // Step 4: Optionally update order status
              db.query(
                'UPDATE orders SET status = ? WHERE order_id = ?',
                ['Paid', order_id]
              );

              res.json({ payment_id: result.insertId, status: 'Done' });
            }
          );
        }
      );
    }
  );
});

module.exports = router;
