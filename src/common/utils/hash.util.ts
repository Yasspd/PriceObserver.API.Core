import * as bcrypt from 'bcrypt';

const HASH_ROUNDS = 10;

export async function hashValue(value: string): Promise<string> {
  return bcrypt.hash(value, HASH_ROUNDS);
}

export async function compareHash(
  rawValue: string,
  hashedValue: string,
): Promise<boolean> {
  return bcrypt.compare(rawValue, hashedValue);
}
