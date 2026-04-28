import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import { getUsersCollection } from '@/lib/db';
import { verifyToken, getAuthCookieName } from '@/lib/auth';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(getAuthCookieName())?.value;
    if (!token) {
      return Response.json({ user: null });
    }

    const payload = await verifyToken(token);
    if (!payload?.userId) {
      return Response.json({ user: null });
    }

    const coll = await getUsersCollection();
    const user = await coll.findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    );
    if (!user) {
      return Response.json({ user: null });
    }

    return Response.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name || user.email.split('@')[0],
        avatarUrl: user.avatarUrl || null,
        age: user.age || '',
        gender: user.gender || '',
        bio: user.bio || '',
      },
    });
  } catch {
    return Response.json({ user: null });
  }
}
