import { Router } from 'express';
import passport from 'passport';
import UserController from '../controllers/UserController';

const router = Router();

router.post('/', UserController.registerUser);
router.post('/login', UserController.loginUser);
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  UserController.getCurrentuser
);
router.get('/:id', passport.authenticate('jwt', { session: false }), UserController.getUserById);

export default router;
