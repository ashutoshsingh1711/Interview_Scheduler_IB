require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const app = express();
const appRoutes = require('./routes/index.js');

const PORT = process.env.PORT || 5000;
app.use(cors());

app.use(multer().array());

app.use('/', appRoutes);

app.listen(PORT, () => {
  console.log('Server Started!');
  console.log('Listening on PORT ', PORT);
});
