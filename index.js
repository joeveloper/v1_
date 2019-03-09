import express from 'express';
import bodyParser from 'body-parser';

// Load custom sequelize configuration
import { sequelize } from './models';

const app = express();

const PORT = process.env.PORT || 8080;

/**
 * @route /home
 * Test Server on PORT
 */
app.get('/home', (req, res) => {
  res.status(200).send('Server Works');
});

/**
 * Load and use body parser to parse incoming requests with json
 * or form encoded data
 */
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

sequelize
  .sync()
  .then(() => {
    // eslint-disable-next-line no-console
    console.log(`DB Connected Successfully`);
  })
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server Running on port ${PORT}`);
    });
  });
