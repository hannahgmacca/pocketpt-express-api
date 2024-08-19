import express from 'express';
import Workout, { IWorkout, WorkoutType } from '../models/workout.model';
import { UserDomain } from '../models/domain/user-domain.model';
import { authMiddleware } from '../middlewares';
import { Types } from 'mongoose';
import User from '../models/user.model';
import Exercise, { IExercise } from '../models/exercise.model';

const router = express.Router();

// GET all exercises
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    
    const exercises = await Exercise.find();

    res.json(exercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET a specific workout by ID
router.get('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user: UserDomain = new UserDomain(req.user);

    const exercise = await Exercise.findById(id);

    if (!exercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    res.json(exercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new workout
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    const returnExercises = [];

    for (var exercise of req.body) {
  
      const newExercise = await Exercise.create({
        _id: new Types.ObjectId,
        userId: user._id,
        exerciseName: exercise.exerciseName,
        equipment: exercise.equipment,
        muscleGroup: exercise.muscleGroup,
        isEachSide: exercise.isEachSide || false
      } );

      returnExercises.push(newExercise);
    }

    res.status(201).json(returnExercises);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH/update an existing exercise by ID
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user: UserDomain = new UserDomain(req.user);
    const updatedExercise = await Exercise.findById(id)


    if (!updatedExercise) {
      return res.status(404).json({ message: 'Exercise not found' });
    }

    const exercise = await Exercise.findByIdAndUpdate(id, req.body)

    res.json(exercise);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE a workout by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user: UserDomain = new UserDomain(req.user);
    const deletedExercise = await Exercise.findById(id);

    if (!deletedExercise) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (deletedExercise.userId != user._id) {
      return res.status(403).json({ message: 'Unauthorised' });
    }

    await Exercise.findByIdAndDelete(id)

    res.json({ message: 'Exercise deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
