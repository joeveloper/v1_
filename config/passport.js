import { Strategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import models from '../models';

dotenv.config();

const { User } = models;
const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.SECRET;

export default passport => {
  passport.use(
    // eslint-disable-next-line camelcase
    new Strategy(opts, (jwt_payload, done) => {
      User.findOne({ where: { id: jwt_payload.id } })
        .then(user => {
          if (user) {
            return done(null, user);
          }
          return done(null, false);
        })
        // eslint-disable-next-line no-console
        .catch(err => console.log(err));
    })
  );
};
