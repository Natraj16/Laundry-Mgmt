const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'laundry_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection error:', err.message);
    return;
  }
  console.log('Connected to MySQL database.');
});

module.exports = connection;
