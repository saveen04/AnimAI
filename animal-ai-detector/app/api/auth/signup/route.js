import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/db';
import { hashPassword, createToken, getAuthCookieName } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    const coll = await getUsersCollection();
    const existing = await coll.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(password);
    const user = {
      email: email.toLowerCase().trim(),
      password: hashed,
      name: (name || '').trim() || email.split('@')[0],
      createdAt: new Date().toISOString(),
    };
    const { insertedId } = await coll.insertOne(user);

    const token = await createToken({
      userId: insertedId.toString(),
      email: user.email,
    });

    const response = NextResponse.json({
      user: { id: insertedId.toString(), email: user.email, name: user.name },
    });
    response.cookies.set(getAuthCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: err.message || 'Signup failed' },
      { status: 500 }
    );
  }
}
