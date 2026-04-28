/**
 * Seed default admin user. Run: node scripts/seed-user.js
 * Requires: MONGODB_URI in env or .env
 */
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'animal_detector';

const DEFAULT_USERS = [
  { email: 'admin@animaldetector.com', password: 'Admin@123', name: 'Admin' },
  { email: 'demo@animaldetector.com', password: 'Demo@123', name: 'Demo User' },
];

async function seed() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  const coll = db.collection('users');

  for (const u of DEFAULT_USERS) {
    const existing = await coll.findOne({ email: u.email });
    if (existing) {
      console.log(`User ${u.email} already exists, skipping.`);
      continue;
    }
    const hashed = await bcrypt.hash(u.password, 12);
    await coll.insertOne({
      email: u.email,
      password: hashed,
      name: u.name,
      createdAt: new Date().toISOString(),
    });
    console.log(`Created user: ${u.email}`);
  }

  await client.close();
  console.log('\nDefault credentials:');
  console.log('  Admin: admin@animaldetector.com / Admin@123');
  console.log('  Demo:  demo@animaldetector.com / Demo@123');
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
