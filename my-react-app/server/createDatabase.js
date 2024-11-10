const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcrypt');
const db = new sqlite3.Database('./mydb.sqlite');

// Function to insert a user with hashed password
function insertUser(username, password, firstName, lastName, callback) {
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
      return callback(err);
    }
    
    db.run(
      `INSERT INTO users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, firstName, lastName],
      function(err) {
        if (err) {
          console.error('Error inserting into users:', err.message);
          return callback(err);
        } else {
          console.log(`Inserted user with ID ${this.lastID}`);
          callback(null);
        }
      }
    );
  });
}

db.serialize(() => {
  // Create Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT,
    first_name TEXT,
    last_name TEXT
  )`, (err) => {
    if (err) {
      console.error('Error creating users table:', err.message);
    } else {
      console.log('Users table created successfully with first and last names');
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

 // Insert data into Users table with hashed passwords
 const users = [
  ['john_doe', 'password123', 'John', 'Doe'],
  ['jane_smith', 'password456', 'Jane', 'Smith'],
  ['mike_jones', 'password789', 'Mike', 'Jones']
];

let userInsertCount = 0; // Counter for how many users have been inserted

users.forEach(user => {
  bcrypt.hash(user[1], 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err.message);
    } else {
      // Insert the user with the hashed password
      db.run(`INSERT INTO users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)`, 
      [user[0], hashedPassword, user[2], user[3]], function(err) {
        if (err) {
          console.error('Error inserting into users:', err.message);
        } else {
          console.log(`Inserted user with ID ${this.lastID}`);
        }
        userInsertCount++;
        // Check if all users are inserted, then close the database
        if (userInsertCount === users.length) {
          db.close((err) => {
            if (err) {
              console.error('Error closing database:', err.message);
            } else {
              console.log('Database connection closed');
            }
          });
        }
      });
    }
  });
});

  // Insert data into Pets table
  const pets = [
    [1, 'Buddy', 'Dog', 'Golden Retriever', 'Morning and Evening', 'None', 'Daily walks, loves to play fetch'],
    [1, 'Max', 'Dog', 'Labrador', 'Twice daily', 'Arthritis', 'Short walks, soft bedding'],
    [1, 'Bella', 'Cat', 'Maine Coon', 'Once daily', 'No issues', 'Weekly grooming'],
    [1, 'Charlie', 'Parrot', 'Macaw', 'Twice daily', 'Feather plucking', 'Daily cage cleaning, social interaction'],
    [1, 'Goldie', 'Fish', 'Goldfish', 'Once daily', 'No issues', 'Weekly water changes'],
    [1, 'Spike', 'Dog', 'Bulldog', 'Once daily', 'Skin allergies', 'Special hypoallergenic shampoo'],
    [2, 'Whiskers', 'Cat', 'Siamese', 'Twice daily', 'Allergies', 'Groom once a week'],
    [2, 'Mittens', 'Cat', 'Persian', 'Once daily', 'Dental issues', 'Daily dental treats'],
    [2, 'Rex', 'Dog', 'Beagle', 'Twice daily', 'None', 'Daily run, weekly grooming'],
    [2, 'Tweety', 'Bird', 'Canary', 'Once daily', 'No issues', 'Sunlight daily'],
    [2, 'Chirpy', 'Bird', 'Budgie', 'Twice daily', 'Wing injury', 'Regular vet check-ups'],
    [2, 'Bubbles', 'Fish', 'Betta', 'Once daily', 'No issues', 'Weekly water changes'],
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

  // Insert data into Schedules table
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

  // Insert data into Medical Records table
  const medicalRecords = [
    [1, 'Routine check-up: Healthy, all vaccinations up to date'],
    [1, 'Arthritis medication prescribed, needs joint supplement'],
    [2, 'Routine check-up: Healthy, vaccinations up to date'],
    [3, 'Annual vet visit: Healthy, no issues reported']
  ];

  medicalRecords.forEach(record => {
    db.run(`INSERT INTO medical_records (pet_id, record) VALUES (?, ?)`,
      record, function(err) {
        if (err) {
          console.error('Error inserting into medical_records:', err.message);
        } else {
          console.log(`Inserted medical record with ID ${this.lastID}`);
        }
      });
  });
});