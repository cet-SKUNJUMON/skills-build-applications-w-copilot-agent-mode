import { Router } from 'express';
import { calculatePoints, createToken, fallbackColor, hashPassword, verifyPassword } from './auth';
import { Activity, Team, User, Workout } from './models';

const router = Router();

router.get('/users', async (_request, response, next) => {
  try {
    response.json(await User.find().select('-passwordHash').sort({ name: 1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/auth/register', async (request, response, next) => {
  try {
    const { name, email, password, grade, fitnessLevel } = request.body;
    if (!name || !email || !password || password.length < 8) {
      response.status(400).json({ message: 'Name, email, and a password of at least 8 characters are required.' });
      return;
    }
    const user = await User.create({
      name,
      email,
      passwordHash: hashPassword(password),
      grade,
      fitnessLevel,
      avatarColor: fallbackColor(email),
    });
    response.status(201).json({ token: createToken(user.id), user: { ...user.toObject(), passwordHash: undefined } });
  } catch (error) {
    next(error);
  }
});

router.post('/auth/login', async (request, response, next) => {
  try {
    const user = await User.findOne({ email: request.body.email });
    if (!user || !verifyPassword(request.body.password || '', user.passwordHash)) {
      response.status(401).json({ message: 'Invalid email or password.' });
      return;
    }
    response.json({ token: createToken(user.id), user: { ...user.toObject(), passwordHash: undefined } });
  } catch (error) {
    next(error);
  }
});

router.get('/activities', async (_request, response, next) => {
  try {
    response.json(await Activity.find().populate('user', 'name avatarColor').sort({ activityDate: -1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/activities', async (request, response, next) => {
  try {
    const { user, type, duration, distance, activityDate, notes } = request.body;
    const activity = await Activity.create({
      user,
      type,
      duration,
      distance,
      activityDate,
      notes,
      points: calculatePoints(type, Number(duration), Number(distance)),
    });
    response.status(201).json(await activity.populate('user', 'name avatarColor'));
  } catch (error) {
    next(error);
  }
});

router.delete('/activities/:id', async (request, response, next) => {
  try {
    const activity = await Activity.findByIdAndDelete(request.params.id);
    response.status(activity ? 204 : 404).send();
  } catch (error) {
    next(error);
  }
});

router.get('/teams', async (_request, response, next) => {
  try {
    response.json(await Team.find().populate('members', 'name grade avatarColor').sort({ name: 1 }));
  } catch (error) {
    next(error);
  }
});

router.post('/teams', async (request, response, next) => {
  try {
    response.status(201).json(await Team.create(request.body));
  } catch (error) {
    next(error);
  }
});

router.get('/leaderboard', async (_request, response, next) => {
  try {
    const standings = await Activity.aggregate([
      { $group: { _id: '$user', points: { $sum: '$points' }, minutes: { $sum: '$duration' }, activities: { $sum: 1 } } },
      { $sort: { points: -1 } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { _id: 0, userId: '$_id', name: '$user.name', grade: '$user.grade', avatarColor: '$user.avatarColor', points: 1, minutes: 1, activities: 1 } },
    ]);
    response.json(standings);
  } catch (error) {
    next(error);
  }
});

router.get('/workouts', async (request, response, next) => {
  try {
    const filter = request.query.level ? { level: request.query.level } : {};
    response.json(await Workout.find(filter).sort({ duration: 1 }));
  } catch (error) {
    next(error);
  }
});

router.get('/workouts/recommended/:userId', async (request, response, next) => {
  try {
    const user = await User.findById(request.params.userId);
    if (!user) {
      response.status(404).json({ message: 'User not found.' });
      return;
    }
    response.json(await Workout.find({ level: user.fitnessLevel }).sort({ duration: 1 }).limit(3));
  } catch (error) {
    next(error);
  }
});

export default router;