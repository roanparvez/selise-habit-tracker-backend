import { Request, Response } from 'express';
import Habit from '../models/habit.model';
import { calculateStreak } from '../utils/calculateStreak';

// Create a new habit
export const createHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const habit = await Habit.create({
      ...req.body,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      habit,
    });
  } catch (error) {
    console.error('Create Habit Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get all habits for the authenticated user
export const getHabits = async (req: Request, res: Response): Promise<void> => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.status(200).json({ success: true, habits });
  } catch (error) {
    console.error('Get Habits Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a habit
export const updateHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ success: true, habit });
  } catch (error) {
    console.error('Update Habit Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Delete a habit
export const deleteHabit = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ success: true, message: 'Habit deleted' });
  } catch (error) {
    console.error('Delete Habit Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Mark a habit as completed for today
export const markHabitComplete = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];

    const habit = await Habit.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
    }

    const completedDates = habit.completedDates as Date[];
    const alreadyCompletedToday = completedDates.some(
      (d) => new Date(d).toISOString().split('T')[0] === todayStr
    );

    if (!alreadyCompletedToday) {
      completedDates.push(today);
    }

    completedDates.sort(
      (a, b) => new Date(a).getTime() - new Date(b).getTime()
    );

    const { currentStreak, longestStreak } = calculateStreak(
      completedDates,
      habit.frequency as 'daily' | 'weekly' | 'monthly'
    );

    habit.currentStreak = currentStreak;
    habit.longestStreak = longestStreak;

    await habit.save();

    res.status(200).json({ success: true, habit });
  } catch (error) {
    console.error('Complete Habit Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Get summary of all habits
export const getHabitSummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ user: userId });

    const now = new Date();
    let longestStreakOverall = 0;
    let activeHabits = 0;

    for (const habit of habits) {
      const completedDates = habit.completedDates as Date[];

      if (!completedDates || completedDates.length === 0) continue;

      completedDates.sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      );

      const { longestStreak, currentStreak } = calculateStreak(
        completedDates,
        habit.frequency as 'daily' | 'weekly' | 'monthly'
      );

      if (
        habit.longestStreak !== longestStreak ||
        habit.currentStreak !== currentStreak
      ) {
        habit.longestStreak = longestStreak;
        habit.currentStreak = currentStreak;
        await habit.save();
      }

      longestStreakOverall = Math.max(longestStreakOverall, longestStreak);

      const lastCompleted = new Date(
        Math.max(...completedDates.map((d) => new Date(d).getTime()))
      );

      const diffInDays =
        (now.getTime() - lastCompleted.getTime()) / (1000 * 3600 * 24);

      const isActive =
        (habit.frequency === 'daily' && diffInDays <= 1) ||
        (habit.frequency === 'weekly' && diffInDays <= 7) ||
        (habit.frequency === 'monthly' && diffInDays <= 31);

      if (isActive) {
        activeHabits++;
      }
    }

    res.status(200).json({
      success: true,
      summary: {
        totalHabits: habits.length,
        activeHabits,
        longestStreak: longestStreakOverall,
      },
    });
  } catch (error) {
    console.error('Get Habit Summary Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
