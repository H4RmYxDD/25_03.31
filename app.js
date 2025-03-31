import express from "express";
import { initializeDatabase, dbAll, dbGet, dbRun } from "./util/database.js";

const app = express();
app.use(express.json());

app.get("/wizards", async (req, res) => {
  const wizards = await dbAll("SELECT * FROM wizards");
  res.status(200).json(wizards);
});

app.get("/wizards/:id", async (req, res) => {
  const id = req.params.id;
  const wizard = await dbGet("SELECT * FROM wizards WHERE id = ?;", [id]);
  if (!wizard) {
    return res.status(404).json({ message: "Wizard not found" });
  }
  res.status(200).json(wizard);
});

app.post("/wizards", async (req, res) => {
  const { name, wand, house } = req.body;
  if (!name || !wand || !house) {
    return res.status(400).send("name, wand and house are required");
  }
  const result = await dbRun(
    "INSERT INTO wizards (name, wand, house) VALUES (?, ?, ?)",
    [name, wand, house]
  );
  res.status(201).json({ id: result.lastID, name, wand, house });
});

app.put("/wizards", async (req, res) => {
    const id = req.params.id
  const wizard = dbGet("SELECT * FROM wizards WHERE id =?", [id]);
  if (!wizard) {
    return res.status(400).send("name, wand and house are required");
  }
  const { name, wand, house } = req.body;
  if (!name || !wand || !house) {
    return res.status(400).send("name, wand and house are required");
  }
  await dbRun("UPDATE wizards SET name=?, wand=?, house=? WHERE id =?", [
    name,
    wand,
    house,
  ]);
  res.status(201).json({ id, name, wand, house });
});

app.delete("/wizards/:id", async (req, res) => {
  const id = req.params.id;
  const wizard = await dbGet("SELECT * FROM wizards WHERE id = ?", [id]);
  if (!wizard) {
    return res.status(404).json({ message: "Wizard not found" });
  }
  await dbRun("DELETE FROM wizards WHERE id = ?", [id]);
  res.status(200).json({ message: "wizard deleted successfully" });
});

// app.use((err, req, res, next) => {
//     res.status(500).json({ message: `Error: ${err.message}` });
//   });

async function startServer() {
  await initializeDatabase();
  app.listen(3000, () => {
    console.log("Server runs on port 3000");
  });
}
startServer();
