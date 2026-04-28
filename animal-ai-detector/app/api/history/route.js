import { getDetectionsCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const auth = await getAuthFromRequest(request);
    const userId = auth?.userId || null;
    const coll = await getDetectionsCollection();
    const query = userId ? { userId } : {};
    const detections = await coll
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();
    const serialized = detections.map((d) => ({
      _id: d._id.toString(),
      label: d.label,
      confidence: d.confidence,
      description: d.description,
      createdAt: d.createdAt,
      imageBase64: d.imageBase64 || null,
      imageMimeType: d.imageMimeType || null,
    }));
    return Response.json({ detections: serialized });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message || 'Failed to load history' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return Response.json({ error: 'ID required' }, { status: 400 });

    const { ObjectId } = require('mongodb');
    const coll = await getDetectionsCollection();
    const result = await coll.deleteOne({ _id: new ObjectId(id), userId: auth.userId });

    if (result.deletedCount === 0) {
      return Response.json({ error: 'Detection not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
