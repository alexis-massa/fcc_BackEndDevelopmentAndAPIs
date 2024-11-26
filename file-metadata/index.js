var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer')

var app = express();

const upload = multer()

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
  if (!req.file) return res.json(400).json({ error: 'No file provided.' })

  const { originalname, mimetype, size } = req.file

  return res.json({ name: originalname, type: mimetype, size: size })
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
