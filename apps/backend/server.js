const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

// Initialize DB schema and seed from db.json if empty
db.serialize(() => {
  // Destinations
  db.run(`CREATE TABLE IF NOT EXISTS destinations (
    id TEXT PRIMARY KEY,
    name TEXT,
    state TEXT,
    country TEXT,
    image TEXT,
    rating REAL,
    type TEXT,
    description TEXT,
    placesToVisit TEXT
  )`);

  // Hotels
  db.run(`CREATE TABLE IF NOT EXISTS hotels (
    id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT,
    rating REAL,
    reviews INTEGER,
    price INTEGER,
    image TEXT,
    amenities TEXT
  )`);

  // Taxis
  db.run(`CREATE TABLE IF NOT EXISTS taxis (
    id TEXT PRIMARY KEY,
    name TEXT,
    type TEXT,
    location TEXT,
    rating REAL,
    price INTEGER,
    perKm INTEGER,
    image TEXT
  )`);

  // Rides
  db.run(`CREATE TABLE IF NOT EXISTS rides (
    id TEXT PRIMARY KEY,
    driverName TEXT,
    vehicleType TEXT,
    vehicleModel TEXT,
    baseFare INTEGER,
    perKmRate INTEGER,
    rating REAL,
    image TEXT,
    city TEXT
  )`);

  // Restaurants
  db.run(`CREATE TABLE IF NOT EXISTS restaurants (
    id TEXT PRIMARY KEY,
    name TEXT,
    location TEXT,
    rating REAL,
    reviews INTEGER,
    avgCostForTwo INTEGER,
    image TEXT,
    cuisineType TEXT,
    vegOnly INTEGER
  )`);

  // Packages
  db.run(`CREATE TABLE IF NOT EXISTS packages (
    id TEXT PRIMARY KEY,
    title TEXT,
    duration TEXT,
    price INTEGER,
    image TEXT,
    rating REAL,
    features TEXT,
    vendorName TEXT
  )`);

  // Check if destinations table is empty to seed
  db.get('SELECT COUNT(*) as count FROM destinations', (err, row) => {
    if (row && row.count === 0) {
      console.log('Database is empty. Seeding from db.json...');
      const dbJsonPath = path.resolve(__dirname, '../../db.json');
      if (fs.existsSync(dbJsonPath)) {
        const rawData = fs.readFileSync(dbJsonPath);
        const data = JSON.parse(rawData);

        const insertDest = db.prepare('INSERT INTO destinations VALUES (?,?,?,?,?,?,?,?,?)');
        data.destinations?.forEach(d => insertDest.run(d.id, d.name, d.state, d.country, d.image, d.rating, d.type, d.description, JSON.stringify(d.placesToVisit || [])));
        insertDest.finalize();

        const insertHotel = db.prepare('INSERT INTO hotels VALUES (?,?,?,?,?,?,?,?)');
        data.hotels?.forEach(h => insertHotel.run(h.id, h.name, h.location, h.rating, h.reviews, h.price, h.image, JSON.stringify(h.amenities || [])));
        insertHotel.finalize();

        const insertTaxi = db.prepare('INSERT INTO taxis VALUES (?,?,?,?,?,?,?,?)');
        data.taxis?.forEach(t => insertTaxi.run(t.id, t.name, t.type, t.location, t.rating, t.price, t.perKm ? 1 : 0, t.image));
        insertTaxi.finalize();

        const insertRide = db.prepare('INSERT INTO rides VALUES (?,?,?,?,?,?,?,?,?)');
        data.rides?.forEach(r => insertRide.run(r.id, r.driverName, r.vehicleType, r.vehicleModel, r.baseFare, r.perKmRate, r.rating, r.image, r.city));
        insertRide.finalize();

        const insertRest = db.prepare('INSERT INTO restaurants VALUES (?,?,?,?,?,?,?,?,?)');
        data.restaurants?.forEach(r => insertRest.run(r.id, r.name, r.location, r.rating, r.reviews, r.avgCostForTwo, r.image, r.cuisineType, r.vegOnly ? 1 : 0));
        insertRest.finalize();

        const insertPack = db.prepare('INSERT INTO packages VALUES (?,?,?,?,?,?,?,?)');
        data.packages?.forEach(p => insertPack.run(p.id, p.title, p.duration, p.price, p.image, p.rating, JSON.stringify(p.features || []), p.vendorName));
        insertPack.finalize();

        console.log('Seeding complete.');
      }
    }
  });
});

// Helper function to query DB and return promise
const queryAll = (table) => {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM ${table}`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// API Endpoints
app.get('/destinations', async (req, res) => {
  try {
    const rows = await queryAll('destinations');
    // parse placesToVisit
    rows.forEach(r => { if (r.placesToVisit) r.placesToVisit = JSON.parse(r.placesToVisit); });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/hotels', async (req, res) => {
  try {
    const rows = await queryAll('hotels');
    rows.forEach(r => { if (r.amenities) r.amenities = JSON.parse(r.amenities); });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/taxis', async (req, res) => {
  try {
    const rows = await queryAll('taxis');
    rows.forEach(r => { r.perKm = r.perKm === 1; });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/rides', async (req, res) => {
  try {
    const rows = await queryAll('rides');
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/restaurants', async (req, res) => {
  try {
    const rows = await queryAll('restaurants');
    rows.forEach(r => { r.vegOnly = r.vegOnly === 1; });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

app.get('/packages', async (req, res) => {
  try {
    const rows = await queryAll('packages');
    rows.forEach(r => { if (r.features) r.features = JSON.parse(r.features); });
    res.json(rows);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

const PORT = 3004;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Real Express Backend with SQLite running on port ${PORT}`);
});
