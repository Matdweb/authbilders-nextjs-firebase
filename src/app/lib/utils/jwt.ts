'use server';
import jwt from 'jsonwebtoken';

const RESET_SECRET = process.env.RESET_TOKEN_SECRET!;
const RESET_TOKEN_EXP = '5m'; // 15 minutes

export async function createResetPasswordToken(email: string) {
  return jwt.sign({ email }, RESET_SECRET, { expiresIn: RESET_TOKEN_EXP });
}

export async function verifyResetPasswordToken(token: string) {
  try {
    const payload = jwt.verify(token, RESET_SECRET) as { email: string };
    if (payload) {
      return payload.email;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}

export async function createVerificationEmailToken(email: string) {
  return jwt.sign({ email }, RESET_SECRET, { expiresIn: RESET_TOKEN_EXP });
}

export async function verifyVerificationEmailToken(token: string) {
  try {
    const payload = jwt.verify(token, RESET_SECRET) as { email: string };
    if (payload) {
      return payload.email;
    }
  } catch (error) {
    console.log(error);
    return;
  }
}