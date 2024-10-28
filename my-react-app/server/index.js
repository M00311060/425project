const express = require('express');
const app = express();
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database
const db = new sqlite3.Database('./mydb.sqlite', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Create the jobs table and insert a sample job
db.serialize(() => {
    // Create the jobs table
    db.run(`CREATE TABLE IF NOT EXISTS jobs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        salary INTEGER
    )`, (err) => {
        if (err) {
            console.error('Error creating jobs table:', err.message);
        } else {
            console.log('Jobs table created successfully');
            // Insert a sample job
            db.run(`INSERT INTO jobs (title, description, salary) VALUES ('Software Engineer', 'Develops software applications', 80000)`, (err) => {
                if (err) {
                    console.error('Error inserting job:', err.message);
                } else {
                    console.log('Sample job inserted successfully');
                }
            });
        }
    });
});

// Example endpoint to get jobs
app.get('/api/jobs', (req, res) => {
    db.all('SELECT * FROM jobs', [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({ data: rows });
    });
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
