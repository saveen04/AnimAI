import { getDetectionsCollection } from '@/lib/db';
import { AI_SERVICE_URL, ANIMAL_DESCRIPTIONS } from '@/lib/constants';
import { getAuthFromRequest } from '@/lib/auth';
import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

export async function POST(request) {
  try {
    const auth = await getAuthFromRequest(request);
    const userId = auth?.userId || null;
    const formData = await request.formData();
    const image = formData.get('image');

    if (!image || !(image instanceof Blob)) {
      return Response.json({ error: 'No image provided' }, { status: 400 });
    }

    const filename = image.name || 'neural_scan.jpg';
    const buffer = Buffer.from(await image.arrayBuffer());
    const base64 = buffer.toString('base64');
    const imageMimeType = image.type || 'image/jpeg';
    const MAX_IMAGE_BYTES = 2_000_000;

    // Local Detection Logic using predict.py
    let label = 'unknown';
    let confidence = 0;

    try {
      // Save temp image for predict.py
      const tempPath = path.join(process.cwd(), 'tmp_scan.jpg');
      fs.writeFileSync(tempPath, buffer);

      const predictPath = path.join(process.cwd(), 'ai-model', 'predict.py');
      const venvPythonPath = path.join(process.cwd(), 'ai-model', 'venv', 'Scripts', 'python.exe');
      const output = execSync(`"${venvPythonPath}" "${predictPath}" "${tempPath}"`, { encoding: 'utf8' });

      // Parse output: "Class: <label>, Confidence: <conf>"
      const match = output.match(/Class: (.*), Confidence: (.*)/);
      if (match) {
        label = match[1].trim();
        confidence = parseFloat(match[2]);
      }

      // Cleanup
      if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
    } catch (predictErr) {
      console.error('Local prediction failed:', predictErr);
      // Fallback to basic label if local fails
      label = 'biological_entity';
      confidence = 0.5;
    }

    const description =
      ANIMAL_DESCRIPTIONS[label.toLowerCase()] ||
      ANIMAL_DESCRIPTIONS.default;

    const shouldStoreImage = buffer.byteLength <= MAX_IMAGE_BYTES;
    const record = {
      userId,
      label,
      confidence: Number(confidence),
      description,
      filename,
      imageBase64: shouldStoreImage ? base64 : null,
      imageMimeType: shouldStoreImage ? imageMimeType : null,
      createdAt: new Date().toISOString(),
    };

    try {
      const coll = await getDetectionsCollection();
      const { insertedId } = await coll.insertOne(record);
      record._id = insertedId.toString();
    } catch (dbErr) {
      console.error('DB save failed:', dbErr);
    }

    return Response.json({
      label: record.label,
      confidence: record.confidence,
      description: record.description,
      filename: record.filename,
      createdAt: record.createdAt,
      _id: record._id,
      imageBase64: record.imageBase64,
      imageMimeType: record.imageMimeType,
    });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: err.message || 'Detection failed' },
      { status: 500 }
    );
  }
}
