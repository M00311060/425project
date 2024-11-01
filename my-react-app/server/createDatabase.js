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
const users = [
  ['john_doe', 'password123'],
  ['jane_smith', 'password456'],
  ['mike_jones', 'password789']
];
users.forEach(user => {
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, user, function(err) {
    if (err) {
      console.error('Error inserting into users:', err.message);
    } else {
      console.log(`Inserted user with ID ${this.lastID}`);
    }
  });
});

// Insert data into Pets table
const pets = [
  // Pets for user_id 1 (john_doe)
  [1, 'Buddy', 'Dog', 'Golden Retriever', 'Morning and Evening', 'None', 'Daily walks, loves to play fetch'],
  [1, 'Max', 'Dog', 'Labrador', 'Twice daily', 'Arthritis', 'Short walks, soft bedding'],
  [1, 'Bella', 'Cat', 'Maine Coon', 'Once daily', 'No issues', 'Weekly grooming'],
  [1, 'Charlie', 'Parrot', 'Macaw', 'Twice daily', 'Feather plucking', 'Daily cage cleaning, social interaction'],
  [1, 'Goldie', 'Fish', 'Goldfish', 'Once daily', 'No issues', 'Weekly water changes'],
  [1, 'Spike', 'Dog', 'Bulldog', 'Once daily', 'Skin allergies', 'Special hypoallergenic shampoo'],

  // Pets for user_id 2 (jane_smith)
  [2, 'Whiskers', 'Cat', 'Siamese', 'Twice daily', 'Allergies', 'Groom once a week'],
  [2, 'Mittens', 'Cat', 'Persian', 'Once daily', 'Dental issues', 'Daily dental treats'],
  [2, 'Rex', 'Dog', 'Beagle', 'Twice daily', 'None', 'Daily run, weekly grooming'],
  [2, 'Tweety', 'Bird', 'Canary', 'Once daily', 'No issues', 'Sunlight daily'],
  [2, 'Chirpy', 'Bird', 'Budgie', 'Twice daily', 'Wing injury', 'Regular vet check-ups'],
  [2, 'Bubbles', 'Fish', 'Betta', 'Once daily', 'No issues', 'Weekly water changes'],

  // Pets for user_id 3 (mike_jones)
  [3, 'Flash', 'Turtle', 'Red-Eared Slider', 'Twice a week', 'Shell rot', 'UVB light, shell care'],
  [3, 'Coco', 'Dog', 'Poodle', 'Twice daily', 'None', 'Regular grooming, hypoallergenic shampoo'],
  [3, 'Shadow', 'Cat', 'Black Shorthair', 'Twice daily', 'Anxiety', 'Calming pheromones, quiet environment'],
  [3, 'Blaze', 'Rabbit', 'Angora', 'Once daily', 'None', 'Weekly brushing, nail trims'],
  [3, 'Finn', 'Fish', 'Guppy', 'Once daily', 'No issues', 'Weekly water changes'],
  [3, 'Lucky', 'Dog', 'Dachshund', 'Twice daily', 'Back issues', 'Avoid stairs, soft bedding']
];
pets.forEach(pet => {
  db.run(`INSERT INTO pets (user_id, name, species, breed, feeding_schedule, medical_history, care_needs) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    pet, function(err) {
      if (err) {
        console.error('Error inserting into pets:', err.message);
      } else {
        console.log(`Inserted pet with ID ${this.lastID}`);
      }
    });
});

// Insert data into Schedules table (one for each pet)
const schedules = [
  [1, '08:00', '10:00', '2024-12-01'],
  [1, '08:30', '10:15', '2024-11-18'],
  [1, '09:00', '11:00', '2024-11-25'],
  [1, '07:00', '09:00', '2024-11-30'],
  [1, '08:30', '10:30', '2024-11-20'],
  [1, '09:00', '11:30', '2024-12-05'],

  [2, '09:00', '10:00', '2024-11-15'],
  [2, '10:00', '11:30', '2024-12-02'],
  [2, '07:30', '09:30', '2024-12-10'],
  [2, '09:15', '10:45', '2024-12-17'],
  [2, '08:00', '11:00', '2024-11-28'],
  [2, '09:45', '11:15', '2024-12-03'],

  [3, '07:00', '09:30', '2024-11-22'],
  [3, '08:15', '10:45', '2024-12-04'],
  [3, '06:30', '10:00', '2024-12-06'],
  [3, '08:45', '11:30', '2024-12-10'],
  [3, '07:15', '10:30', '2024-11-30'],
  [3, '09:30', '10:15', '2024-12-01']
];
schedules.forEach(schedule => {
  db.run(`INSERT INTO schedules (pet_id, feeding_time, grooming_time, vet_visit) VALUES (?, ?, ?, ?)`,
    schedule, function(err) {
      if (err) {
        console.error('Error inserting into schedules:', err.message);
      } else {
        console.log(`Inserted schedule with ID ${this.lastID}`);
      }
    });
});

// Insert data into Medical Records table (one for each pet)
const medicalRecords = [
  [1, 'Routine check-up: Healthy, all vaccinations up to date.'],
  [2, 'Check-up: Allergies managed, new diet suggested.'],
  [3, 'Dental cleaning completed, no further issues.'],
  [4, 'Wing injury healed, flight training started.'],
  [5, 'Routine check-up: No issues detected.'],
  [6, 'Arthritis medication dosage adjusted.'],

  [7, 'Check-up: Regular vaccinations administered.'],
  [8, 'Dental issues: Scaling and polishing recommended.'],
  [9, 'Routine check-up: Healthy and active.'],
  [10, 'Wing injury recovery progressing well.'],
  [11, 'Routine check-up: Healthy, water temperature adjusted.'],
  [12, 'Feather plucking issue managed with supplements.'],

  [13, 'Shell rot treatment ongoing, improvement noted.'],
  [14, 'Regular grooming completed, no skin issues.'],
  [15, 'Routine check-up: Anxiety managed with pheromones.'],
  [16, 'Routine grooming and nail trimming completed.'],
  [17, 'Routine check-up: Healthy, no issues detected.'],
  [18, 'Back issues improved with new bedding.']
];
medicalRecords.forEach(record => {
  db.run(`INSERT INTO medical_records (pet_id, record) VALUES (?, ?)`,
    record, function(err) {
      if (err) {
        console.error('Error inserting into medical records:', err.message);
      } else {
        console.log(`Inserted medical record with ID ${this.lastID}`);
      }
    });
});

db.close()})
