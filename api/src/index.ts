import express from "express";
import { Pool } from "pg";
import { PoolData } from "../../database";

import defiLlama_crawler from "../../crawler/src/defillama"

const app = express();
const port = 3000;

const pool = new Pool(PoolData);

app.get("/api/data", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM dapp_sites");
    res.json(rows);
  } catch (error) {
    console.error("Error executing query", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World! Welcome to the Whitelist API!");
});

app.get("/crawler", async (req, res) =>{
  await defiLlama_crawler();
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
