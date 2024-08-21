import express from 'express';
import { UserDomain } from '../models/domain/user-domain.model';
import { authMiddleware } from '../middlewares';
import ExerciseHistory from '../models/exercise-history.model';
import Workout from '../models/workout.model';
import { processCompletedWorkout } from './services/exercise-history.service';

const router = express.Router();

// GET all exercise histories
router.get(`/:userId/:exerciseId`, authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    const { userId, exerciseId } = req.params;

    if (user._id.toString() != userId) {
      return res.status(403).json({ message: 'Unauthorised' });
    }
    
    const exerciseHistory = await ExerciseHistory.findOne({exerciseId: exerciseId, userId: userId});

    res.json(exerciseHistory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Process all workouts for performance metrics
router.get(`/`, authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    
    const workouts = await Workout.find({userId: user._id });
    
    for (const workout of workouts) {
      // This processes each workout one by one, synchronously.
      await processCompletedWorkout(workout, user._id);
    }

    return res.json('Success!')
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
