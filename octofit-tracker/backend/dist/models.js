"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Workout = exports.Activity = exports.Team = exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    grade: { type: Number, min: 9, max: 12, default: 9 },
    fitnessLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    avatarColor: { type: String, default: '#0f766e' },
}, { timestamps: true });
const teamSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    motto: { type: String, default: '' },
    color: { type: String, default: '#0f766e' },
    members: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });
const activitySchema = new mongoose_1.default.Schema({
    user: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: ['Running', 'Walking', 'Cycling', 'Strength', 'Swimming'], required: true },
    duration: { type: Number, min: 1, required: true },
    distance: { type: Number, min: 0, default: 0 },
    points: { type: Number, min: 0, required: true },
    activityDate: { type: Date, default: Date.now },
    notes: { type: String, default: '' },
}, { timestamps: true });
const workoutSchema = new mongoose_1.default.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    duration: { type: Number, min: 1, required: true },
    category: { type: String, required: true },
    exercises: [{ type: String }],
}, { timestamps: true });
exports.User = mongoose_1.default.model('User', userSchema);
exports.Team = mongoose_1.default.model('Team', teamSchema);
exports.Activity = mongoose_1.default.model('Activity', activitySchema);
exports.Workout = mongoose_1.default.model('Workout', workoutSchema);
