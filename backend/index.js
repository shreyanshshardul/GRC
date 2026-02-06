import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";
import dotenv from "dotenv"

dotenv.config();
const PORT = process.env.PORT||8000
const app = express();
app.use(cors());
app.use(express.json()); // JSON parsing

// SQLite DB connect
const db = new sqlite3.Database("./risks.db", (err) => {
  if (err) console.log("DB error", err);
  else console.log("SQLite connected");
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
    level TEXT,
    hint TEXT
  )
`, (err) => {
  if (err) console.log("Table creation error:", err);
  else console.log("Table ready");
});

// Add risk
app.post("/api/v1/add-risk", (req, res) => {
  const { asset, threat, likelihood, impact, hint } = req.body;
  if(!asset || !threat){
    return res.status(400).json({message:"All fields are mandatory" , success:false});
  }

  const score = likelihood * impact;

  let level = "Low";
  if (score > 12) level = "Critical";
  else if (score > 8) level = "High";
  else if (score > 5) level = "Medium";

  db.run(
    `INSERT INTO risks (asset, threat, likelihood, impact, score, level)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [asset, threat, likelihood, impact, score, level],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      //  return full object for frontend
      const newRisk = { 
        id: this.lastID, 
        asset, 
        threat, 
        likelihood, 
        impact, 
        score, 
        level,
        hint
      };
      res.json(newRisk);
    }
  );
});


// Get all risks
app.get("/api/v1/risks", (req, res) => {
  db.all("SELECT * FROM risks", [], (err, rows) => {
    if (err) res.status(500).json({ error: err.message });
    else res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
