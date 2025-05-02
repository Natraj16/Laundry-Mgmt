const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/customers', require('./routes/customers'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/employees', require('./routes/employees'));
app.use('/api/services', require('./routes/services'));

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
