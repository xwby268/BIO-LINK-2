const { MongoClient } = require('mongodb');
const config = require('./config');

let client;
let db;

async function connectDB() {
  if (db) return db;
  try {
    client = new MongoClient(config.MONGODB_URI);
    await client.connect();
    db = client.db('baeci_store');
    console.log('MongoDB Connected');
    return db;
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
}

module.exports = { connectDB };