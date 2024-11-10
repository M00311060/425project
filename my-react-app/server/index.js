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
  const { pet_id, feeding_time, grooming_time, vet_visit } = req.body;
  db.run(`INSERT INTO schedules (pet_id, feeding_time, grooming_time, vet_visit) VALUES (?, ?, ?, ?)`, 
    [pet_id, feeding_time, grooming_time, vet_visit], function (err) {
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
  const { pet_id, feeding_time, grooming_time, vet_visit } = req.body;
  db.run(`UPDATE schedules SET pet_id = ?, feeding_time = ?, grooming_time = ?, vet_visit = ? WHERE id = ?`, 
    [pet_id, feeding_time, grooming_time, vet_visit, id], function (err) {
      if (err) {
        res.status(404).json({ error: err.message });
        return;
      }
      res.json({ updatedID: id });
    });
});

// Delete a schedule by ID
app.delete('/api/schedules/:id', (req, res) => {
  const { id } = req.params;
  db.run(`DELETE FROM schedules WHERE id = ?`, [id], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.json({ deletedID: id });
  });
});

// CRUD operations for Medical Records
app.post('/api/medical-records', (req, res) => {
  const { pet_id, record } = req.body;
  db.run(`INSERT INTO medical_records (pet_id, record) VALUES (?, ?)`, [pet_id, record], function (err) {
    if (err) {
      res.status(404).json({ error: err.message });
      return;
    }
    res.status(201).json({ id: this.lastID });
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