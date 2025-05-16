const express = require('express');
const router = express.Router();
const db = require('../db');

// Get employee details by employee_id
router.get('/:employee_id', (req, res) => {
  const { employee_id } = req.params;
console.log('Fetching employee:', employee_id);
  const query = `SELECT * FROM employees WHERE employee_id = ?`;

  db.query(query, [employee_id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
     console.log('DB result:', result);
    if (result.length === 0) return res.status(404).json({ error: 'Employee not found' });
    res.json(result[0]);
  });
});

module.exports = router;
