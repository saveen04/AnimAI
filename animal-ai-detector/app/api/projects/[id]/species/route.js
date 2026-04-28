import { getProjectsCollection } from '@/lib/db';
import { getAuthFromRequest } from '@/lib/auth';
import { ObjectId } from 'mongodb';

export async function POST(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params;
    const { 
      name, imageUrl, location, scientificProof, description, 
      authorizedSignature, scientificDocument, verificationMarkers 
    } = await request.json();

    if (!name) return Response.json({ error: 'Species name is required' }, { status: 400 });

    const coll = await getProjectsCollection();
    const newSpecies = {
      id: Date.now().toString(),
      name,
      imageUrl: imageUrl || null,
      scientificProof: scientificProof || null,
      description: description || null,
      authorizedSignature: authorizedSignature || null,
      scientificDocument: scientificDocument || null,
      verificationMarkers: verificationMarkers || { hasEmblem: false, hasStamp: false, hasSignature: false },
      detectedAt: new Date().toISOString(),
      location: location || null,
    };

    const result = await coll.updateOne(
      { _id: new ObjectId(id), userId: auth.userId },
      { $push: { species: newSpecies } }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Project not found' }, { status: 404 });
    }

    return Response.json(newSpecies);
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params; // project id
    const { speciesId, name, description, scientificProof, scientificDocument, verificationMarkers } = await request.json();

    const coll = await getProjectsCollection();
    const result = await coll.updateOne(
      { _id: new ObjectId(id), userId: auth.userId, "species.id": speciesId },
      { 
        $set: { 
          "species.$.name": name,
          "species.$.description": description,
          "species.$.scientificProof": scientificProof,
          "species.$.scientificDocument": scientificDocument,
          "species.$.verificationMarkers": verificationMarkers,
          "species.$.updatedAt": new Date().toISOString()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return Response.json({ error: 'Species not found' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const auth = await getAuthFromRequest(request);
    if (!auth) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = params; // project id
    const url = new URL(request.url);
    const speciesId = url.searchParams.get('speciesId');

    if (!speciesId) return Response.json({ error: 'Species ID required' }, { status: 400 });

    const coll = await getProjectsCollection();
    const result = await coll.updateOne(
      { _id: new ObjectId(id), userId: auth.userId },
      { $pull: { species: { id: speciesId } } }
    );

    if (result.modifiedCount === 0) {
      return Response.json({ error: 'Species not found or already deleted' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
