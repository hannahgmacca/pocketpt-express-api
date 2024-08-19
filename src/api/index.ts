import express from 'express';

import MessageResponse from '../interfaces/MessageResponse';
import user from './user.routes';
import auth from './auth.routes';
import exercise from './exercises.routes';
import workout from './workout.routes';
import role from './role.routes';
import exerciseHistory from './exercise-history.route';

const router = express.Router();

router.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'API - 👋🌎🌍🌏',
  });
});

router.use('/auth', auth);
router.use('/user', user);
router.use('/roles', role);
router.use('/exercise', exercise);
router.use('/workout', workout);
router.use('/exercise-history', exerciseHistory);

export default router;
