import express from 'express';

const app = express();

const PORT = 8080;

app.get('/home', (req, res) => {
  res.status(200).send('Server Works');
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server Running on port ${PORT}`);
});
