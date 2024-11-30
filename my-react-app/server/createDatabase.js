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
    gender TEXT,
    weight REAL,
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

// Create new Schedules table
db.run(`CREATE TABLE IF NOT EXISTS schedules (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER,
  vet_visit_time TEXT,
  vet_visit_date TEXT,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
)`, (err) => {
  if (err) {
    console.error('Error creating schedules table:', err.message);
  } else {
    console.log('Schedules table created successfully with vet visit time and date');
  }
});

// Create new feed Schedule table
db.run(`CREATE TABLE IF NOT EXISTS feeding_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER,
  feeding_time TEXT,
  feeding_date TEXT,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
)`, (err) => {
  if (err) {
    console.error('Error creating feeding schedule table:', err.message);
  } else {
    console.log('Feeding schedule table created successfully with feeding time and date');
  }
});

// Create new grooming Schedule table
db.run(`CREATE TABLE IF NOT EXISTS grooming_schedule (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pet_id INTEGER,
  grooming_time TEXT,
  grooming_date TEXT,
  FOREIGN KEY (pet_id) REFERENCES pets(id)
)`, (err) => {
  if (err) {
    console.error('Error creating grooming schedule table:', err.message);
  } else {
    console.log('Feeding schedule table created successfully with grooming time and date');
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
    [1, 'Buddy', 'Dog', 'Golden Retriever', 'Male', 30.5, 'Morning and Evening', 'None', 'Daily walks, loves to play fetch'],
    [1, 'Max', 'Dog', 'Labrador', 'Male', 28.0, 'Twice daily', 'Arthritis', 'Short walks, soft bedding'],
    [1, 'Bella', 'Cat', 'Maine Coon', 'Female', 4.2, 'Once daily', 'No issues', 'Weekly grooming'],
    [1, 'Charlie', 'Parrot', 'Macaw', 'Male', 1.0, 'Twice daily', 'Feather plucking', 'Daily cage cleaning, social interaction'],
    [1, 'Goldie', 'Fish', 'Goldfish', 'Unknown', 0.1, 'Once daily', 'No issues', 'Weekly water changes'],
    [1, 'Spike', 'Dog', 'Bulldog', 'Male', 20.0, 'Once daily', 'Skin allergies', 'Special hypoallergenic shampoo'],
    [2, 'Whiskers', 'Cat', 'Siamese', 'Female', 3.8, 'Twice daily', 'Allergies', 'Groom once a week'],
    [2, 'Mittens', 'Cat', 'Persian', 'Female', 3.5, 'Once daily', 'Dental issues', 'Daily dental treats'],
    [2, 'Rex', 'Dog', 'Beagle', 'Male', 22.0, 'Twice daily', 'None', 'Daily run, weekly grooming'],
    [2, 'Tweety', 'Bird', 'Canary', 'Unknown', 0.2, 'Once daily', 'No issues', 'Sunlight daily'],
    [2, 'Chirpy', 'Bird', 'Budgie', 'Female', 0.1, 'Twice daily', 'Wing injury', 'Regular vet check-ups'],
    [2, 'Bubbles', 'Fish', 'Betta', 'Male', 0.1, 'Once daily', 'No issues', 'Weekly water changes'],
    [3, 'Flash', 'Turtle', 'Red-Eared Slider', 'Male', 2.5, 'Twice a week', 'Shell rot', 'UVB light, shell care'],
    [3, 'Coco', 'Dog', 'Poodle', 'Female', 12.0, 'Twice daily', 'None', 'Regular grooming, hypoallergenic shampoo'],
    [3, 'Shadow', 'Cat', 'Black Shorthair', 'Male', 4.0, 'Twice daily', 'Anxiety', 'Calming pheromones, quiet environment'],
    [3, 'Blaze', 'Rabbit', 'Angora', 'Female', 3.0, 'Once daily', 'None', 'Weekly brushing, nail trims'],
    [3, 'Finn', 'Fish', 'Guppy', 'Male', 0.1, 'Once daily', 'No issues', 'Weekly water changes'],
    [3, 'Lucky', 'Dog', 'Dachshund', 'Male', 8.0, 'Twice daily', 'Back issues', 'Avoid stairs, soft bedding']
  ];  

  pets.forEach(pet => {
    db.run(
      `INSERT INTO pets (user_id, name, species, breed, gender, weight, feeding_schedule, medical_history, care_needs) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      pet,
      function(err) {
        if (err) {
          console.error('Error inserting into pets:', err.message);
        } else {
          console.log(`Inserted pet with ID ${this.lastID}`);
        }
      }
    );
  });  

  // Insert data into Schedules table
const schedules = [
  [1, '08:00', '2024-12-10'],
  [1, '08:30', '2024-11-20'],
  [1, '09:00', '2024-12-02'],
  [1, '07:00', '2024-11-29'],
  [1, '08:30', '2024-12-03'],
  [1, '09:00', '2024-12-06'],
  [2, '09:00', '2024-12-05'],
  [2, '10:00', '2024-12-08'],
  [2, '07:30', '2024-12-15'],
  [2, '09:15', '2024-12-20'],
  [2, '08:00', '2024-11-30'],
  [2, '09:45', '2024-12-09'],
  [3, '07:00', '2024-11-23'],
  [3, '08:00', '2024-12-03'],
  [3, '08:30', '2024-12-07'],
  [3, '09:00', '2024-11-22'],
  [3, '09:30', '2024-12-12'],
  [3, '07:30', '2024-12-01']
];

schedules.forEach(schedule => {
  db.run(`INSERT INTO schedules (pet_id, vet_visit_time, vet_visit_date) VALUES (?, ?, ?)`,
    schedule, function(err) {
      if (err) {
        console.error('Error inserting into schedules:', err.message);
      } else {
        console.log(`Inserted schedule with ID ${this.lastID}`);
      }
    });
  });

    // Insert data into Schedules table
const feeding_schedule = [
  [1, '04:00', '2024-12-10'],
  [1, '03:30', '2024-11-20'],
  [1, '04:00', '2024-12-02'],
  [1, '09:00', '2024-11-29'],
  [1, '04:30', '2024-12-03'],
  [1, '07:00', '2024-12-06'],
  [2, '06:00', '2024-12-05'],
  [2, '12:00', '2024-12-08'],
  [2, '11:30', '2024-12-15'],
  [2, '04:15', '2024-12-20'],
  [2, '09:00', '2024-11-30'],
  [2, '07:45', '2024-12-09'],
  [3, '06:00', '2024-11-23'],
  [3, '04:00', '2024-12-03'],
  [3, '07:30', '2024-12-07'],
  [3, '10:00', '2024-11-22'],
  [3, '06:30', '2024-12-12'],
  [3, '04:30', '2024-12-01']
];

feeding_schedule.forEach(feeding_schedule => {
  db.run(`INSERT INTO feeding_schedule (pet_id, feeding_time, feeding_date) VALUES (?, ?, ?)`,
    feeding_schedule, function(err) {
      if (err) {
        console.error('Error inserting into feeding_schedule:', err.message);
      } else {
        console.log(`Inserted feeding_schedule with ID ${this.lastID}`);
      }
    });
  });

    // Insert data into Schedules table
const grooming_schedule = [
  [1, '04:00', '2024-12-10'],
  [1, '05:30', '2024-11-20'],
  [1, '10:00', '2024-12-02'],
  [1, '11:00', '2024-11-29'],
  [1, '12:30', '2024-12-03'],
  [1, '11:00', '2024-12-06'],
  [2, '08:00', '2024-12-05'],
  [2, '03:00', '2024-12-08'],
  [2, '06:30', '2024-12-15'],
  [2, '07:15', '2024-12-20'],
  [2, '09:00', '2024-11-30'],
  [2, '10:45', '2024-12-09'],
  [3, '11:00', '2024-11-23'],
  [3, '06:00', '2024-12-03'],
  [3, '05:30', '2024-12-07'],
  [3, '04:00', '2024-11-22'],
  [3, '04:30', '2024-12-12'],
  [3, '08:30', '2024-12-01']
];

grooming_schedule.forEach(grooming_schedule => {
  db.run(`INSERT INTO grooming_schedule (pet_id, grooming_time, grooming_date) VALUES (?, ?, ?)`,
    grooming_schedule, function(err) {
      if (err) {
        console.error('Error inserting into grooming_schedule:', err.message);
      } else {
        console.log(`Inserted grooming_schedule with ID ${this.lastID}`);
      }
    });
  });
});

