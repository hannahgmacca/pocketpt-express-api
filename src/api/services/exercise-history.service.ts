import { Types } from 'mongoose';
import ExerciseHistory, { ExerciseHistoryRequest, RoundHistoricalItem } from '../../models/exercise-history.model';
import { IRound } from '../../models/round.model';
import { IExercise } from '../../models/exercise.model';
import Workout, { IWorkout } from '../../models/workout.model';

export const processCompletedWorkout = async (workout: IWorkout, userId: Types.ObjectId): Promise<void> => {
  if (!workout.completedDateTime) return;
  // round best efforts
  const bestEfforts: Record<
    string,
    {
      exercise: IExercise;
      bestEffortWeightKg: number;
      bestEffortVolumeKg: number;
      weightRound: IRound;
      volumeRound: IRound;
      weightIndex: number;
      volumeIndex: number;
    }
  > = {};

  await Promise.all(
    workout.completedRoundList.map(async (round) => {
      round.setList.flat().map(async (set, i) => {
        // Check if exercise records exits
        const bestEffortExercise = bestEfforts[set.exercise._id.toString()];

        // if exercise was each side then we need to double it
        // so it can be compared to sets with same exercise
        const weightKg = set.exercise.isEachSide ? set.weightKg * 2 : set.weightKg;

        const roundCopy = { ...round };

        if (!set.totalVolumeKg) {
          set.totalVolumeKg = set.repCount * weightKg;
        }

        if (!set.isPersonalBest) {
          set.isPersonalBest = { weightKg: false, volumeKg: false };
        }

        if (bestEffortExercise) {
          if (bestEffortExercise.bestEffortVolumeKg < set.totalVolumeKg) {
            bestEffortExercise.bestEffortVolumeKg = set.totalVolumeKg;
            bestEffortExercise.volumeIndex = i;
            if (roundCopy.setList) roundCopy.setList.flat()[i].isPersonalBest.volumeKg = true;
            bestEffortExercise.volumeRound = roundCopy;
          }

          if (bestEffortExercise.bestEffortWeightKg < weightKg) {
            bestEffortExercise.bestEffortWeightKg = weightKg;
            bestEffortExercise.weightIndex = i;
            if (roundCopy.setList) roundCopy.setList.flat()[i].isPersonalBest.weightKg = true;
            bestEffortExercise.weightRound = roundCopy;
          }
        } else {
          if (roundCopy.setList) roundCopy.setList.flat()[i].isPersonalBest.volumeKg = true;
          if (roundCopy.setList) roundCopy.setList.flat()[i].isPersonalBest.weightKg = true;
          bestEfforts[set.exercise._id.toString()] = {
            exercise: set.exercise,
            bestEffortVolumeKg: set.totalVolumeKg,
            bestEffortWeightKg: weightKg,
            weightRound: roundCopy,
            volumeRound: roundCopy,
            weightIndex: i,
            volumeIndex: i,
          };
        }
      });
    }),
  );

  await Promise.all(
    Object.keys(bestEfforts).map(async (exerciseId) => {
      if (!workout.completedDateTime) return;

      const exerciseBestEffort = bestEfforts[exerciseId];
      const roundHistoricalItem = new RoundHistoricalItem(
        exerciseBestEffort.weightRound,
        workout._id,
        workout.completedDateTime,
      );

      let exerciseHistory = await ExerciseHistory.findOne({ exerciseId: exerciseId, userId: userId });

      if (exerciseHistory) {
        const isPbVolume = exerciseBestEffort.bestEffortVolumeKg > exerciseHistory.personalBest.volumeKg;
        const isPbWeight = exerciseBestEffort.bestEffortWeightKg > exerciseHistory.personalBest.weightKg;

        // update personal best and personal best rounds
        if (isPbVolume) {
          exerciseHistory.personalBest.volumeKg = exerciseBestEffort.bestEffortVolumeKg;
          exerciseHistory.personalBestRounds.volumeKg = exerciseBestEffort.volumeRound;
          roundHistoricalItem.wasPersonalBest.volumeKg = true;
          roundHistoricalItem.bestEffort.volumeKg = exerciseBestEffort.bestEffortVolumeKg;

          // find set to update isPB to true
          const round = workout.completedRoundList.find((r) => r._id == exerciseBestEffort.volumeRound._id);
          const set = round?.setList.flat()[exerciseBestEffort.volumeIndex];

          if (set) {
            set.isPersonalBest.volumeKg = true;
          }
        }

        if (isPbWeight) {
          exerciseHistory.personalBest.weightKg = exerciseBestEffort.bestEffortWeightKg;
          exerciseHistory.personalBestRounds.weightKg = exerciseBestEffort.weightRound;
          roundHistoricalItem.wasPersonalBest.weightKg = true;
          roundHistoricalItem.bestEffort.volumeKg = exerciseBestEffort.bestEffortWeightKg;

          // find set to update isPB to true
          const round = workout.completedRoundList.find((r) => r._id == exerciseBestEffort.weightRound._id);
          const set = round?.setList.flat()[exerciseBestEffort.weightIndex];

          if (set) {
            set.isPersonalBest.weightKg = true;
          }
        }
      } else {
        const newExerciseHistoryRequest: ExerciseHistoryRequest = {
          userId: userId,
          exerciseId: new Types.ObjectId(exerciseId),
          exercise: exerciseBestEffort.exercise,
          personalBest: {
            weightKg: exerciseBestEffort.bestEffortWeightKg,
            volumeKg: exerciseBestEffort.bestEffortVolumeKg,
          },
          personalBestRounds: { weightKg: exerciseBestEffort.weightRound, volumeKg: exerciseBestEffort.volumeRound },
          roundList: [],
        };

        exerciseHistory = await ExerciseHistory.create(newExerciseHistoryRequest);

        roundHistoricalItem.wasPersonalBest.volumeKg = true;
        roundHistoricalItem.bestEffort.volumeKg = exerciseBestEffort.bestEffortVolumeKg;
        roundHistoricalItem.wasPersonalBest.weightKg = true;
        roundHistoricalItem.bestEffort.volumeKg = exerciseBestEffort.bestEffortWeightKg;
      }

      // check if we have already added a historical round for this workout and exercise
      const existingWorkoutRoundIndex = exerciseHistory.roundList.findIndex((r) => {
        return r.workoutId.equals(workout._id);
      });

      if (existingWorkoutRoundIndex >= 0) {
        exerciseHistory.roundList[existingWorkoutRoundIndex] = roundHistoricalItem;
      } else {
        // push new historical round to start of round list
        exerciseHistory.roundList.unshift(roundHistoricalItem);
      }

      workout.activeRound = null;
      await Workout.findByIdAndUpdate(workout._id, workout, { new: true });
      await exerciseHistory.save();
    }),
  );
};
