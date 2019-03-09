import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
// Load custom sequelize configuration
import { sequelize } from './models';
// Load custom passport configuration
import passportConfig from './config/passport';

// Import app routes
import userRoute from './routes/UserRoute';

const app = express();
const PORT = process.env.PORT || 8080;
const prefix = '/api/v1';

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
// Passport middleware
app.use(passport.initialize());

passportConfig(passport);

app.use(`${prefix}/users`, userRoute);

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
