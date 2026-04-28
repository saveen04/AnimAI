import { getProjectsCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function GET(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const coll = await getProjectsCollection();
    const project = await coll.findOne({ _id: new ObjectId(id), userId: auth.userId });

    if (!project) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(project);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const coll = await getProjectsCollection();
    const result = await coll.deleteOne({ _id: new ObjectId(id), userId: auth.userId });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
