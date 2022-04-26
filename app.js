// Setup the environement variables form a .env file
require("dotenv").config();

const connection = require("./db-config");

// Import expres
const express = require("express");

// We store all express methods in a variable called app
const app = express();

// If an environment variable named PORT exists, we take it in order to let the user change the port without chaning the source code. Otherwise we give a default value of 3000
const port = process.env.PORT ?? 3000;

connection.connect((err) => {
  if (err) {
    console.error('error connecting: ' + err.stack);
  } else {
    console.log('connected to database with threadId :  ' + connection.threadId);
  }
});

app.use(express.json());

app.get("/api/users", (req, res) => {
  connection.query("SELECT * FROM users", (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(result);
    }
  });
});

app.post('/api/users', (req, res) => {
  const { firstname, lastname, email } = req.body;
  // const threadId = req.body;
  connection.query(
    'INSERT INTO users(firstname, lastname, email) VALUES (?, ?, ?)', [firstname, lastname, email],
    (err, result) => {
      if (err) {
        res.status(500).send('Error saving the user');
      } else {
        res.status(200).send('user successfully saved');
      }
    }
  );
});

// We listen to incoming request on the port defined above
app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});