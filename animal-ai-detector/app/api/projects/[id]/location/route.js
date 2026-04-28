import { getProjectsCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function PATCH(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { lat, lng, region } = await request.json();

    if (!lat || !lng || !region) {
      return Response.json({ error: 'Coordinates and region are required' }, { status: 400 });
    }

    const coll = await getProjectsCollection();
    const location = {
      type: 'Point',
      coordinates: [lng, lat], // GeoJSON is [longitude, latitude]
    };

    const result = await coll.updateOne(
      { _id: new ObjectId(id), userId: auth.userId },
      { $set: { location, region } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    // Ensure 2dsphere index exists (runtime check/creation)
    await coll.createIndex({ location: '2dsphere' });

    return Response.json({ success: true, location, region });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
