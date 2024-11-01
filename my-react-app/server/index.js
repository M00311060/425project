const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

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
// CRUD operations for Users
app.post('/api/users', (req, res) => {
  const { username, password } = req.body;
  db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, password], function (err) {
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
  const { username, password } = req.body;
  db.run(`UPDATE users SET username = ?, password = ? WHERE id = ?`, [username, password, id], function (err) {
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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;