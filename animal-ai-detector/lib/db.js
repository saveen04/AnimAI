import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'animal_detector';

let client;
let clientPromise;

if (!MONGODB_URI) {
  throw new Error('Please add your MONGODB_URI to .env.local');
}

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI);
  clientPromise = client.connect();
}

export async function getDb() {
  const c = await clientPromise;
  return c.db(DB_NAME);
}

export async function getDetectionsCollection() {
  const db = await getDb();
  return db.collection('detections');
}

export async function getUsersCollection() {
  const db = await getDb();
  return db.collection('users');
}
export async function getProjectsCollection() {
  const db = await getDb();
  return db.collection('projects');
}
