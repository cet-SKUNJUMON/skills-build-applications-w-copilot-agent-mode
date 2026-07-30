import mongoose from 'mongoose';
import { hashPassword } from '../auth';
import { Activity, Team, User, Workout } from '../models';

const connectionString = process.env.MONGODB_URI || 'mongodb://localhost:27017/octofit_db';

/**
 * Seed the octofit_db database with test data
 */
async function seedDatabase() {
  try {
    await mongoose.connect(connectionString);

    console.log('Connected to octofit_db');

    await Promise.all([Activity.deleteMany({}), Team.deleteMany({}), User.deleteMany({}), Workout.deleteMany({})]);

    const passwordHash = hashPassword('octofit123');
    const users = await User.insertMany([
      { name: 'Maya Chen', email: 'maya@mergington.edu', passwordHash, grade: 10, fitnessLevel: 'Advanced', avatarColor: '#e85d3f' },
      { name: 'Jordan Rivera', email: 'jordan@mergington.edu', passwordHash, grade: 11, fitnessLevel: 'Intermediate', avatarColor: '#147d73' },
      { name: 'Sam Okafor', email: 'sam@mergington.edu', passwordHash, grade: 9, fitnessLevel: 'Beginner', avatarColor: '#db9d24' },
      { name: 'Avery Brooks', email: 'avery@mergington.edu', passwordHash, grade: 12, fitnessLevel: 'Advanced', avatarColor: '#456990' },
      { name: 'Noah Patel', email: 'noah@mergington.edu', passwordHash, grade: 10, fitnessLevel: 'Intermediate', avatarColor: '#8f5d9f' },
    ]);

    await Team.insertMany([
      { name: 'Velocity', motto: 'Move with purpose.', color: '#e85d3f', members: [users[0]._id, users[1]._id, users[4]._id] },
      { name: 'Trailblazers', motto: 'Every step counts.', color: '#147d73', members: [users[2]._id, users[3]._id] },
    ]);

    const now = Date.now();
    await Activity.insertMany([
      { user: users[0]._id, type: 'Running', duration: 42, distance: 6.4, points: 124, activityDate: new Date(now - 2 * 60 * 60 * 1000), notes: 'Tempo run' },
      { user: users[1]._id, type: 'Cycling', duration: 55, distance: 14.2, points: 154, activityDate: new Date(now - 5 * 60 * 60 * 1000), notes: 'River trail' },
      { user: users[2]._id, type: 'Walking', duration: 35, distance: 2.8, points: 49, activityDate: new Date(now - 24 * 60 * 60 * 1000), notes: 'After-school walk' },
      { user: users[3]._id, type: 'Strength', duration: 48, distance: 0, points: 96, activityDate: new Date(now - 28 * 60 * 60 * 1000), notes: 'Upper body circuit' },
      { user: users[4]._id, type: 'Swimming', duration: 40, distance: 1.5, points: 104, activityDate: new Date(now - 48 * 60 * 60 * 1000), notes: 'Interval laps' },
      { user: users[0]._id, type: 'Strength', duration: 35, distance: 0, points: 70, activityDate: new Date(now - 72 * 60 * 60 * 1000) },
      { user: users[1]._id, type: 'Running', duration: 30, distance: 4.5, points: 89, activityDate: new Date(now - 96 * 60 * 60 * 1000) },
    ]);

    await Workout.insertMany([
      { title: 'Foundation Circuit', description: 'A low-impact full-body circuit focused on confident movement.', level: 'Beginner', duration: 20, category: 'Strength', exercises: ['Bodyweight squats', 'Wall push-ups', 'Dead bugs', 'Marching'] },
      { title: 'Walk + Recharge', description: 'Brisk intervals paired with mobility resets.', level: 'Beginner', duration: 25, category: 'Cardio', exercises: ['Brisk walk', 'Calf raises', 'Hip circles'] },
      { title: 'Power 30', description: 'Build strength and stamina with focused work blocks.', level: 'Intermediate', duration: 30, category: 'Strength', exercises: ['Lunges', 'Push-ups', 'Plank taps', 'Glute bridges'] },
      { title: 'Fast Finish', description: 'A progressive run ending with short controlled sprints.', level: 'Intermediate', duration: 35, category: 'Running', exercises: ['Easy jog', 'Tempo run', 'Strides', 'Cooldown'] },
      { title: 'Athlete Engine', description: 'High-intensity conditioning for experienced movers.', level: 'Advanced', duration: 40, category: 'Conditioning', exercises: ['Burpees', 'Jump squats', 'Mountain climbers', 'Shuttle runs'] },
      { title: 'Distance Builder', description: 'Sustain a challenging pace and sharpen endurance.', level: 'Advanced', duration: 50, category: 'Running', exercises: ['Warm-up', 'Steady run', 'Hill repeats', 'Cooldown'] },
    ]);

    console.log('Database seeding complete');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
