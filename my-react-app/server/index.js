const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Initialize Express app
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to SQLite database
const db = new sqlite3.Database('./mydb.sqlite', (err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// User Registration
app.post('/api/users', (req, res) => {
  const { first_name, last_name, username, password } = req.body;

  // Hash the password
  bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Insert the new user into the database with the hashed password
    const query = `INSERT INTO users (first_name, last_name, username, password) VALUES (?, ?, ?, ?)`;
    db.run(query, [first_name, last_name, username, hashedPassword], function (err) {
      if (err) {
        res.status(500).json({ error: 'Error registering user' });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
  });
});

// CRUD operations for Users
app.post('/api/users', (req, res) => {
  const { username, password, first_name, last_name } = req.body;
  db.run(`INSERT INTO users (username, password, first_name, last_name) VALUES (?, ?, ?, ?)`,
    [username, password, first_name, last_name], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/users', (req, res) => {
  db.all(`SELECT * FROM users`, [], (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Get a user by ID
app.get('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM users WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// Update a user by ID
app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { username, password, first_name, last_name } = req.body;
  db.run(`UPDATE users SET username = ?, password = ?, first_name = ?, last_name = ? WHERE id = ?`,
    [username, password, first_name, last_name, id], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.json({ updatedID: id });
    });
});

// Delete a user by ID
app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM users WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }

    if (row) {
      // Compare the hashed password with the entered password
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          res.status(404).json({ error: err.message });
          return;
        }

        if (result) {
          // Password matched
          res.json({ id: row.id, username: row.username, first_name: row.first_name, last_name: row.last_name });
        } else {
          // Invalid password
          res.status(404).json({ error: 'Invalid username or password.' });
        }
      });
    } else {
      res.status(404).json({ error: 'Invalid username or password.' });
    }
  });
});

// Fetch all pets for a user by user_id
app.get('/api/users/:userId/pets', (req, res) => {
  const userId = req.params.userId;
  db.all(`SELECT * FROM pets WHERE user_id = ?`, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ pets: rows });
  });
});

// Get schedules for pets
app.get('/api/users/:userId/pets/schedules', (req, res) => {
  const userId = req.params.userId;

  // Log the userId to ensure it's correctly captured
  console.log(`Fetching schedules for userId: ${userId}`);

  // Query to fetch all pets for the user, including the pet name
  db.all(
    `SELECT pets.id AS pet_id, pets.name AS pet_name, schedules.vet_visit_time, schedules.vet_visit_date
     FROM pets
     LEFT JOIN schedules ON pets.id = schedules.pet_id
     WHERE pets.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: err.message });
        return;
      }
  
      console.log('Fetched rows:', rows);
  
      if (rows.length === 0) {
        console.log('No schedules found for user:', userId);
        res.json({ petSchedules: [] });
        return;
      }
  
      // Map rows into an array of schedule objects with pet name and other details
      const petSchedules = rows.map((row) => ({
        pet_name: row.pet_name, 
        vet_visit_time: row.vet_visit_time,
        vet_visit_date: row.vet_visit_date
      }));
  
      console.log('Pet schedules with pet name:', petSchedules);
      res.json({ petSchedules });
    }
  );
});

// Get pets with owner info
app.get('/api/pets', (req, res) => {
  const query = `
    SELECT pets.id, pets.name, pets.species, pets.breed, pets.feeding_schedule, pets.medical_history, pets.care_needs, 
      users.first_name, users.last_name 
    FROM pets
    JOIN users ON pets.user_id = users.id`;

  db.all(query, [], (err, rows) => {
      if (err) {
          console.error(err);
          res.status(500).send('Error retrieving pets');
      } else {
          res.json({ data: rows });
      }
  });
});

// CRUD operations for Pets
app.post('/api/pets', (req, res) => {
  const { user_id, name, species, breed, feeding_schedule, medical_history, care_needs } = req.body;
  db.run(`INSERT INTO pets (user_id, name, species, breed, feeding_schedule, medical_history, care_needs) VALUES (?, ?, ?, ?, ?, ?, ?)`, 
    [user_id, name, species, breed, feeding_schedule, medical_history, care_needs], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/pets', (req, res) => {
  db.all(`SELECT * FROM pets`, [], (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Get a pet by ID
app.get('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM pets WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// Update a pet by ID
app.put('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  const { user_id, name, species, breed, feeding_schedule, medical_history, care_needs } = req.body;
  db.run(`UPDATE pets SET user_id = ?, name = ?, species = ?, breed = ?, feeding_schedule = ?, medical_history = ?, care_needs = ? WHERE id = ?`, 
    [user_id, name, species, breed, feeding_schedule, medical_history, care_needs, id], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.json({ updatedID: id });
    });
});

// Delete a pet by ID
app.delete('/api/pets/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM pets WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// CRUD operations for Schedules
app.post('/api/schedules', (req, res) => {
  const { pet_id, vet_visit_time, vet_visit_date } = req.body;
  db.run(`INSERT INTO schedules (pet_id, vet_visit_time, vet_visit_date) VALUES (?, ?, ?)`, 
    [pet_id, vet_visit_time, vet_visit_date], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
});

app.get('/api/schedules', (req, res) => {
  db.all(`SELECT * FROM schedules`, [], (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Get a schedule by ID
app.get('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM schedules WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// Update a schedule by ID
app.put('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  const { pet_id, vet_visit_time, vet_visit_date } = req.body;
  db.run(`UPDATE schedules SET pet_id = ?, vet_visit_time = ?, vet_visit_date = ? WHERE id = ?`, 
    [pet_id, vet_visit_time, vet_visit_date, id], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.json({ updatedID: id });
    });
});

app.delete('/api/users/:userId/pets/schedules', (req, res) => {
  const { vet_visit_date } = req.body; // Ensure this is in the request body

  if (!vet_visit_date) {
    return res.status(400).send('vet_visit_date is required');
  }

  // Query the database to delete the schedule
  db.run(
    `DELETE FROM schedules WHERE vet_visit_date = ?`,
    [vet_visit_date],
    function (err) {
      if (err) {
        console.error('Database error:', err.message);
        return res.status(500).send('Error deleting schedule');
      }

      if (this.changes === 0) {
        return res.status(404).send('No schedules found for the specified vet_visit_date and user');
      }

      res.status(200).send({ message: 'Schedule deleted successfully' });
    }
  );
});

// Get all medical records for the logged-in user
app.get('/api/medical-records/user/:userId', (req, res) => {
  const { userId } = req.params;
  
  const query = `
    SELECT 
      medical_records.id AS record_id,
      pets.name AS pet_name,
      medical_records.record AS record
    FROM 
      medical_records
    JOIN 
      pets ON pets.id = medical_records.pet_id
    JOIN 
      users ON users.id = pets.user_id
    WHERE 
      users.id = ?
  `;
  
  db.all(query, [userId], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Add a new medical record using pet name
app.post('/api/medical-records', (req, res) => {
  const { userId, pet_name, record } = req.body;

  // Query to find the pet_id based on pet_name and userId
  const getPetIdQuery = `
    SELECT pets.id AS pet_id 
    FROM pets
    JOIN users ON users.id = pets.user_id
    WHERE pets.name = ? AND users.id = ?
  `;

  db.get(getPetIdQuery, [pet_name, userId], (err, row) => {
    if (err) {
      res.status(500).json({ error: `Error finding pet: ${err.message}` });
      return;
    }
    
    if (!row) {
      res.status(404).json({ error: 'Pet not found for this user.' });
      return;
    }

    const pet_id = row.pet_id;

    // Insert the new medical record with the retrieved pet_id
    const insertRecordQuery = `
      INSERT INTO medical_records (pet_id, record)
      VALUES (?, ?)
    `;

    db.run(insertRecordQuery, [pet_id, record], function (err) {
      if (err) {
        res.status(500).json({ error: `Error adding medical record: ${err.message}` });
        return;
      }
      res.status(201).json({ id: this.lastID });
    });
  });
});

// Function to handle adding a new schedule for a specific pet
app.post('/api/users/:userId/pets/:petId/schedules', (req, res) => {
  const { userId, petId } = req.params;
  const { vet_visit_time, vet_visit_date } = req.body;

  // Ensure at least one schedule field is provided
  if (!vet_visit_time && !vet_visit_date) {
    return res.status(400).json({ error: 'At least one schedule field is required' });
  }

  // Use the time and date directly (no need to split)
  const vetvisittime = vet_visit_time || null;  // Default to null if vet_visit_time is empty
  const vetVisitDate = vet_visit_date || null;  // Default to null if vet_visit_date is empty

  // Check if the pet exists and belongs to the specified user
  const queryCheckPet = `SELECT * FROM pets WHERE id = ? AND user_id = ?`;
  db.get(queryCheckPet, [petId, userId], (err, pet) => {
    if (err) {
      return res.status(500).json({ error: 'Database error while verifying pet' });
    }
    if (!pet) {
      return res.status(404).json({ error: 'Pet not found for this user' });
    }

    // Insert the new schedule into the database
    const queryInsertSchedule = `
      INSERT INTO schedules (pet_id, vet_visit_time, vet_visit_date)
      VALUES (?, ?, ?)
    `;
    db.run(queryInsertSchedule, [petId, vetvisittime, vetVisitDate], function (err) {
      if (err) {
        return res.status(500).json({ error: 'Error adding schedule' });
      }
      res.status(201).json({
        message: 'Schedule added successfully',
        scheduleId: this.lastID,
        petId,
        vetVisitDate,
        vetvisittime, // Return the exact values
      });
    });
  });
});

app.get('/api/medical-records', (req, res) => {
  db.all(`SELECT * FROM medical_records`, [], (err, rows) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: rows });
  });
});

// Get a medical record by ID
app.get('/api/medical-records/:id', (req, res) => {
  const { id } = req.params;
  db.get(`SELECT * FROM medical_records WHERE id = ?`, [id], (err, row) => {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ data: row });
  });
});

// Update a medical record by ID
app.put('/api/medical-records/:id', (req, res) => {
  const { id } = req.params;
  const { pet_id, record } = req.body;
  db.run(`UPDATE medical_records SET pet_id = ?, record = ? WHERE id = ?`, [pet_id, record, id], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ updatedID: id });
  });
});

// Delete a medical record by ID
app.delete('/api/medical-records/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM medical_records WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app; // Export the app without starting the server