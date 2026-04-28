import { getProjectsCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { title } = await request.json();
    if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });

    const coll = await getProjectsCollection();
    const project = {
      userId: auth.userId,
      title,
      region: null,
      location: null,
      species: [],
      createdAt: new Date().toISOString(),
    };

    const { insertedId } = await coll.insertOne(project);
    return Response.json({ ...project, _id: insertedId.toString() });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const coll = await getProjectsCollection();
    const projects = await coll.find({ userId: auth.userId }).sort({ createdAt: -1 }).toArray();
    return Response.json(projects);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
