const express = require('express');
const cors = require('cors');
require('dotenv').config();

if (process.env.NODE_ENV === 'production') {
  const fs = require('fs');
  if (!fs.existsSync('./dist')) {
    console.log('Please (re)run "npm run build" to create the dist folder\n');
    process.exit(1);
  }
}

serveFolder = process.env.NODE_ENV == 'production' ? 'dist' : 'src';

const app = express();
app.use(cors());
const PORT = process.env.PORT || 8080;

app.use(express.static(serveFolder));

app.get('/', (_req, res) => {
  res.sendFile('index.html', { root: __dirname + '/' + serveFolder + '/' });
});

app.listen(PORT, () => {
  console.log('Server live at :' + PORT);
});
