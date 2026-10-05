require('dotenv').config();
const { connectDB, seedDatabase } = require('./db');

async function runSeed() {
  console.log("Starting Hospital Finder Database Seeding...");
  await connectDB();
  await seedDatabase();
  console.log("Seeding complete. Exiting...");
  process.exit(0);
}

runSeed();
