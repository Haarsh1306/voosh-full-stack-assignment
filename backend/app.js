require('dotenv').config();
const cors = require('cors');
const express = require('express');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./routes/auth'));
// app.use('/api/tasks', require('./routes/tasks'));

app.listen(PORT, () => {
  console.log('Server is running on port 3000');
});