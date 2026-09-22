const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database("./students.db", (err) => {
    if (err) {
        console.error("Database connection error:", err.message);
    } else {
        console.log("Connected to SQLite database.");
    }
});

db.run(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        roll_no TEXT UNIQUE NOT NULL,
        department TEXT NOT NULL,
        email TEXT
    )
`);

app.get("/api/students", (req, res) => {
    db.all("SELECT * FROM students ORDER BY id DESC", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

app.post("/api/students", (req, res) => {
    const { name, roll_no, department, email } = req.body;
    if (!name || !roll_no || !department) {
        return res.status(400).json({ error: "பெயர், Roll No, மற்றும் துறை அவசியம்." });
    }

    const query = `INSERT INTO students (name, roll_no, department, email) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, roll_no, department, email], function (err) {
        if (err) {
            return res.status(400).json({ error: "இந்த Roll No ஏற்கனவே உள்ளது." });
        }
        res.json({ message: "மாணவர் விவரம் சேர்க்கப்பட்டது!", id: this.lastID });
    });
});

app.delete("/api/students/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM students WHERE id = ?", id, function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: "விவரம் நீக்கப்பட்டது!" });
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});