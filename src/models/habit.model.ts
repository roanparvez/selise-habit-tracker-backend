import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
  title: string;
  description?: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  completedDates: Date[];
  currentStreak: number;
  longestStreak: number;
  user: mongoose.Types.ObjectId;
  createdAt: Date;
}

const HabitSchema: Schema = new Schema<IHabit>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly'],
      default: 'daily',
    },
    completedDates: {
      type: [Date],
      default: [],
    },
    currentStreak: {
      type: Number,
      default: 0,
    },
    longestStreak: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('Habit', HabitSchema);
