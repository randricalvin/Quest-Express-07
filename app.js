// Setup the environement variables form a .env file
require("dotenv").config();

const connection = require("./db-config");

// Import expres
const express = require("express");

// We store all express methods in a variable called app
const app = express();

const port = process.env.PORT ?? 3000;

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + connection.threadId);
  }
});

app.use(express.json());
connection.query("SELECT * FROM movies", (err, result) => {
  // Do something when mysql is done executing the query
  console.log(err, result)
});

app.post('/api/movies', (req, res) => {
  const { title, director, year, color, duration } = req.body;
  connection.query(
    "INSERT INTO movies (title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)",
    [title, director, year, color, duration],
      (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error saving a movie');
      } else {
        const createdMovie = { title, director, year, color, duration };
        res.status(201).json(createdMovie);
      }
    }
  );
});

app.put('/api/movies/:id', (req, res) => {
  const movieId = req.params.id;
  const moviePropsToUpdate = req.body;
  connection.query(
    'UPDATE movies SET ? WHERE id = ?',
    [moviePropsToUpdate, movieId],
    (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).send('Error updating a movie');
      } else if (result.affectedRows === 0) {
        res.status(404).send('Movie not found.');
      } else {
        res.sendStatus(204);
      }
    });
});

// We listen to incoming request on the port defined above
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});