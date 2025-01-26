const express = require('express');
const fileUpload = require('express-fileupload');
const pdfParser = require('pdf-parse');
const cors = require('cors');
const app = express();
require('dotenv').config();

app.use(cors(
  {
    origin: process.env.ORIGIN_URL,
    credentials: true
  }
));
app.use(fileUpload());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/upload', (req, res) => {
  const { file } = req.files;
  const buffer = file.data;

  pdfParser(buffer).then((data) => {
    res.status(200).send(data.text);
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
