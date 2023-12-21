import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.send('Start develop');
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log('Server is OK...');
});
