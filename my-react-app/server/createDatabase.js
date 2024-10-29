const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./mydb.sqlite');

db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully');
    }
  });

  // Create Pets table
  db.run(`CREATE TABLE IF NOT EXISTS pets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    name TEXT,
    species TEXT,
    breed TEXT,
    feeding_schedule TEXT,
    medical_history TEXT,
    care_needs TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating pets table:', err.message);
    } else {
      console.log('Pets table created successfully');
    }
  });

  // Create Schedules table
  db.run(`CREATE TABLE IF NOT EXISTS schedules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    feeding_time TEXT,
    grooming_time TEXT,
    vet_visit TEXT,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating schedules table:', err.message);
    } else {
      console.log('Schedules table created successfully');
    }
  });

  // Create Medical Records table
  db.run(`CREATE TABLE IF NOT EXISTS medical_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    pet_id INTEGER,
    record TEXT,
    FOREIGN KEY (pet_id) REFERENCES pets(id)
  )`, (err) => {
    if (err) {
      console.error('Error creating medical records table:', err.message);
    } else {
      console.log('Medical records table created successfully');
    }
  });

  // Insert data into Users table
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, ['john_doe', 'password123'], function(err) {
    if (err) {
      console.error('Error inserting into users:', err.message);
    } else {
      console.log(`Inserted user with ID ${this.lastID}`);
    }
  });

  // Insert data into Pets table
  db.run(`INSERT INTO pets (user_id, name, species, breed, feeding_schedule, medical_history, care_needs) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [1, 'Buddy', 'Dog', 'Golden Retriever', 'Morning and Evening', 'None', 'Daily walks, loves to play fetch'], function(err) {
      if (err) {
        console.error('Error inserting into pets:', err.message);
      } else {
        console.log(`Inserted pet with ID ${this.lastID}`);
      }
    });

  // Insert data into Schedules table
  db.run(`INSERT INTO schedules (pet_id, feeding_time, grooming_time, vet_visit) VALUES (?, ?, ?, ?)`,
    [1, '08:00', '10:00', '2024-12-01'], function(err) {
      if (err) {
        console.error('Error inserting into schedules:', err.message);
      } else {
        console.log(`Inserted schedule with ID ${this.lastID}`);
      }
    });

  // Insert data into Medical Records table
  db.run(`INSERT INTO medical_records (pet_id, record) VALUES (?, ?)`,
    [1, 'Routine check-up: Healthy, all vaccinations up to date.'], function(err) {
      if (err) {
        console.error('Error inserting into medical records:', err.message);
      } else {
        console.log(`Inserted medical record with ID ${this.lastID}`);
      }
    });
});

db.close();
