const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
app.use(express.json());
const pathDB = path.join(__dirname, "cricketTeam.db");
let db = null;
initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: pathDB,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

// GET API 1

app.get("/players/", async (request, response) => {
  const playersArray = `
    SELECT * FROM cricket_team;`;
  playersOutput = await db.all(playersArray);
  response.send(playersOutput);
});

// POST API 2

app.post("/players/", async (request, response) => {
  const playerDetails = request.body;
  const { playerName, jerseyNumber, role } = playerDetails;
  const playerQuery = `
    INSERT INTO cricket_team (player_name,jersey_number,role)
    VALUES ("${playerName}",
    ${jerseyNumber},
    "${role}");`;
  const playerObject = await db.run(playerQuery);
  response.send("Player Added to Team");
});

//GET API 3

app.get("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const query = `SELECT * FROM cricket_team
    WHERE player_id = ${playerId};`;
  const output = await db.get(query);
  response.send(output);
});

// PUT API 4

app.put("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const newDetails = request.body;
  const { playerName, jerseyNumber, role } = newDetails;
  const newQuery = `
    UPDATE cricket_team SET 
    player_name = "${playerName}",
    jersey_number = ${jerseyNumber},
    role = "${role}"
    WHERE player_id = ${playerId};`;
  await db.run(newQuery);
  response.send("Player Details Updated");
});

// DELETE API 5

app.delete("/players/:playerId", async (request, response) => {
  const { playerId } = request.params;
  const deleteQuery = `
    DELETE FROM cricket_team WHERE player_id = ${playerId};`;
  await db.run(deleteQuery);
  response.send("Player Removed");
});

module.exports = app;
