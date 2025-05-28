import { Request, Response } from 'express';
import Habit from '../models/habit.model';

export const createHabit = async (req: Request, res: Response) => {
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

export const getHabits = async (req: Request, res: Response) => {
  try {
    const habits = await Habit.find({ user: req.user.id });
    res.status(200).json({ success: true, habits });
  } catch (error) {
    console.error('Get Habits Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update a habit
export const updateHabit = async (req: Request, res: Response) => {
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
export const deleteHabit = async (req: Request, res: Response) => {
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

// Mark as completed (add today’s date)
export const markHabitComplete = async (req: Request, res: Response) => {
  try {
    const today = new Date();
    const habit = await Habit.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $addToSet: { completedDates: today } }, // prevents duplicates
      { new: true }
    );

    if (!habit) {
      res.status(404).json({ message: 'Habit not found' });
    }

    res.status(200).json({ success: true, habit });
  } catch (error) {
    console.error('Complete Habit Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getHabitSummary = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const habits = await Habit.find({ user: userId });

    const totalHabits = habits.length;
    const activeHabits = habits.filter((h) => h.isActive !== false).length;

    // Calculate longest streak
    const getLongestStreak = (dates: Date[]) => {
      const sorted = dates
        .map((d) => new Date(d))
        .sort((a, b) => a.getTime() - b.getTime());
      let longest = 0,
        current = 1;

      for (let i = 1; i < sorted.length; i++) {
        const diff =
          (sorted[i].getTime() - sorted[i - 1].getTime()) / (1000 * 3600 * 24);
        if (diff === 1) {
          current++;
          longest = Math.max(longest, current);
        } else {
          current = 1;
        }
      }

      return Math.max(longest, 1);
    };

    let longestStreak = 0;
    for (const habit of habits) {
      if (
        Array.isArray(habit.completedDates) &&
        habit.completedDates.length > 0
      ) {
        longestStreak = Math.max(
          longestStreak,
          getLongestStreak(habit.completedDates)
        );
      }
    }

    res.status(200).json({
      success: true,
      summary: {
        totalHabits,
        activeHabits,
        longestStreak,
      },
    });
  } catch (error) {
    console.error('Get Habit Summary Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
