import { createHash, createHmac, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

const tokenSecret = process.env.TOKEN_SECRET || 'octofit-local-development-secret';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(':');
  if (!salt || !hash) return false;

  const storedBuffer = Buffer.from(hash, 'hex');
  const suppliedBuffer = scryptSync(password, salt, 64);
  return storedBuffer.length === suppliedBuffer.length && timingSafeEqual(storedBuffer, suppliedBuffer);
}

export function createToken(userId: string): string {
  const issuedAt = Date.now().toString();
  const payload = Buffer.from(`${userId}:${issuedAt}`).toString('base64url');
  const signature = createHmac('sha256', tokenSecret).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function calculatePoints(type: string, duration: number, distance = 0): number {
  const multipliers: Record<string, number> = {
    Running: 2.2,
    Walking: 1,
    Cycling: 1.5,
    Strength: 2,
    Swimming: 2.4,
  };
  return Math.round(duration * (multipliers[type] || 1) + distance * 5);
}

export function fallbackColor(value: string): string {
  return `#${createHash('md5').update(value).digest('hex').slice(0, 6)}`;
}