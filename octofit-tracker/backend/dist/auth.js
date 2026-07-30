"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashPassword = hashPassword;
exports.verifyPassword = verifyPassword;
exports.createToken = createToken;
exports.calculatePoints = calculatePoints;
exports.fallbackColor = fallbackColor;
const crypto_1 = require("crypto");
const tokenSecret = process.env.TOKEN_SECRET || 'octofit-local-development-secret';
function hashPassword(password) {
    const salt = (0, crypto_1.randomBytes)(16).toString('hex');
    const hash = (0, crypto_1.scryptSync)(password, salt, 64).toString('hex');
    return `${salt}:${hash}`;
}
function verifyPassword(password, storedHash) {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash)
        return false;
    const storedBuffer = Buffer.from(hash, 'hex');
    const suppliedBuffer = (0, crypto_1.scryptSync)(password, salt, 64);
    return storedBuffer.length === suppliedBuffer.length && (0, crypto_1.timingSafeEqual)(storedBuffer, suppliedBuffer);
}
function createToken(userId) {
    const issuedAt = Date.now().toString();
    const payload = Buffer.from(`${userId}:${issuedAt}`).toString('base64url');
    const signature = (0, crypto_1.createHmac)('sha256', tokenSecret).update(payload).digest('base64url');
    return `${payload}.${signature}`;
}
function calculatePoints(type, duration, distance = 0) {
    const multipliers = {
        Running: 2.2,
        Walking: 1,
        Cycling: 1.5,
        Strength: 2,
        Swimming: 2.4,
    };
    return Math.round(duration * (multipliers[type] || 1) + distance * 5);
}
function fallbackColor(value) {
    return `#${(0, crypto_1.createHash)('md5').update(value).digest('hex').slice(0, 6)}`;
}
