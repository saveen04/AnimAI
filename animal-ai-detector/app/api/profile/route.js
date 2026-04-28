import { NextResponse } from 'next/server';
import { getUsersCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request) {
  const auth = await getAuthFromRequest(request);
  if (!auth?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const coll = await getUsersCollection();
  const user = await coll.findOne(
    { _id: new ObjectId(auth.userId) },
    { projection: { password: 0 } }
  );
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  return NextResponse.json({
    user: { 
      id: user._id.toString(), 
      email: user.email, 
      name: user.name || '',
      avatarUrl: user.avatarUrl || null,
      age: user.age || '',
      gender: user.gender || '',
      bio: user.bio || '',
    },
  });
}

export async function PUT(request) {
  const auth = await getAuthFromRequest(request);
  if (!auth?.userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const name = (body.name || '').toString().trim();
  if (!name) {
    return NextResponse.json({ error: 'Name is required' }, { status: 400 });
  }

  const update = { 
    name, 
    age: body.age || '',
    gender: body.gender || '',
    bio: body.bio || '',
    updatedAt: new Date().toISOString() 
  };
  
  if (body.avatarBase64) {
    update.avatarUrl = body.avatarBase64;
  }

  const coll = await getUsersCollection();
  await coll.updateOne(
    { _id: new ObjectId(auth.userId) },
    { $set: update }
  );

  return NextResponse.json({ 
    ok: true, 
    user: { 
      id: auth.userId, 
      name, 
      avatarUrl: update.avatarUrl,
      age: update.age,
      gender: update.gender,
      bio: update.bio
    } 
  });
}
