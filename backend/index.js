import express from "express";
import sqlite3 from "sqlite3";

const app = express();
app.use(express.json()); // JSON parsing

// SQLite DB connect
const db = new sqlite3.Database("./risks.db", (err) => {
  if (err) {
    console.log("DB error", err);
  } else {
    console.log("SQLite connected");
  }
});

// Table create
db.run(`
  CREATE TABLE IF NOT EXISTS risks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    asset TEXT,
    threat TEXT,
    likelihood INTEGER,
    impact INTEGER,
    score INTEGER,
    level TEXT
  )
`, (err) => {
  if (err) console.log("Table creation error:", err);
  else console.log("Table ready");
});

// Add risk
app.post("/add-risk", (req, res) => {
  const { asset, threat, likelihood, impact } = req.body;

  const score = likelihood * impact;

  let level = "Low";
  if (score >= 16) level = "High";
  else if (score >= 8) level = "Medium";

  db.run(
    `INSERT INTO risks (asset, threat, likelihood, impact, score, level)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [asset, threat, likelihood, impact, score, level],
    function (err) {
      if (err) res.status(500).json({ error: err.message });
      else res.json({ message: "Risk added successfully", id: this.lastID });
    }
  );
});

// Get all risks
app.get("/risks", (req, res) => {
  db.all("SELECT * FROM risks", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.listen(8000, () => {
  console.log(`Server running on port 8000`);
});
