import { NextRequest, NextResponse } from 'next/server';
import admin from 'firebase-admin';

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || typeof email !== 'string') {
    return NextResponse.json({ message: 'Invalid email' }, { status: 400 });
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user.emailVerified) {
      return NextResponse.json({ message: 'Already verified' }, { status: 200 });
    }

    await admin.auth().updateUser(user.uid, { emailVerified: true });
    return NextResponse.json({ message: 'Email verified' });
  } catch {
    return NextResponse.json({ message: 'Internal error' }, { status: 500 });
  }
}
