const fs = require('fs');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const port = 9999;

app.use(bodyParser.json());

app.use('/', express.static(__dirname + '/test-client'));
app.use('/', express.static(__dirname + '/src'));
app.use('/', express.static(__dirname + '/node_modules/resemblejs'));

app.get('/snapshots/:index', (req, res) => {
  const snapshotPath = `snapshots/${req.params.index}.txt`;
  const snapshotExists = fs.existsSync(snapshotPath);
  if (snapshotExists) {
    fs.readFile(snapshotPath, (err, dataUrl) => {
      if (err) throw err;
      res.send(dataUrl);
    });
  } else {
    res.status(404).send('');
  }
});

app.post('/snapshots', (req, res) => {
  fs.writeFile(
    `snapshots/${req.body.testIndex}.txt`,
    req.body.updatedImageDataUrl,
    err => {
      if (err) throw err;
      res.send('Success.');
    }
  );
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
