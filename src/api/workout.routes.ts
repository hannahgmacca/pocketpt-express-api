import express from 'express';
import Workout, { IWorkout, WorkoutType } from '../models/workout.model';
import { UserDomain } from '../models/domain/user-domain.model';
import { authMiddleware } from '../middlewares';
import { Types } from 'mongoose';
import User from '../models/user.model';

const router = express.Router();

// GET all workouts
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    
    const workouts = await Workout.find( {userId: user._id} );

    const shortWorkouts = workouts.map(workout => 
      ({ 
        _id: workout._id,
        workoutName: workout.workoutName,
        workoutType: workout.workoutType,
        caloriesBurnt: workout.caloriesBurnt,
        completedDateTime: workout.completedDateTime
      })
  )

    res.json(shortWorkouts);
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

    const workout = await Workout.findById(id);

    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }


    if (workout.userId != user._id) {
      return res.status(403).json({ message: 'Unauthorised' });
    }

    res.json(workout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST a new workout
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user: UserDomain = new UserDomain(req.user);
    const userToUpdate = await User.findById(user._id);

    if (!userToUpdate) {
      return res.status(403).json({ message: 'Unauthorised' });
    }

    const { workoutName, workoutType } = req.body;

    const workout: IWorkout = {
      _id: new Types.ObjectId,
      userId: user._id,
      workoutName,
      workoutType: workoutType as WorkoutType,
      completedRoundList: [],
      activeRound: undefined,
      caloriesBurnt: 0,
      startedDateTime: new Date(),
      completedDateTime: undefined,
      isActive: true
    } 

    const newWorkout = await Workout.create(workout);
    userToUpdate.activeWorkout = newWorkout._id;

    userToUpdate.save();
    res.status(201).json(newWorkout);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// PATCH/update an existing workout by ID
router.patch('/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const user: UserDomain = new UserDomain(req.user);
    const updatedWorkout = await Workout.findById(id)


    if (!updatedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (updatedWorkout.userId != user._id) {
      return res.status(403).json({ message: 'Unauthorised' });
    }

    await Workout.findByIdAndUpdate(id, req.body)

    if (updatedWorkout.completedDateTime && updatedWorkout.isActive) {
      const userToUpdate = await User.findById(user._id);

      if (!userToUpdate) {
        return res.status(403).json({ message: 'Unauthorised' });
      }

      userToUpdate.activeWorkout = null;
      userToUpdate.save();
    }

    res.json(updatedWorkout);
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
    const deletedWorkout = await Workout.findById(id);

    if (!deletedWorkout) {
      return res.status(404).json({ message: 'Workout not found' });
    }

    if (deletedWorkout.id != user._id) {
      return res.status(403).json({ message: 'Unauthorised' });
    }

    await Workout.findByIdAndDelete(id)

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
