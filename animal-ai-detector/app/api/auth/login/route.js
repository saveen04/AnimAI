import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/db';
import { verifyPassword, createToken, getAuthCookieName } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const coll = await getUsersCollection();
    const user = await coll.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    try {
      await coll.updateOne(
        { _id: user._id },
        { $set: { lastLoginAt: new Date().toISOString() } }
      );
    } catch (e) {
      console.error('Failed to update lastLoginAt:', e);
    }

    const token = await createToken({
      userId: user._id.toString(),
      email: user.email,
    });

    const response = NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || user.email.split('@')[0],
      },
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
      { error: err.message || 'Login failed' },
      { status: 500 }
    );
  }
}
