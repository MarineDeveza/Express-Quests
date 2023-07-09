require("dotenv").config();
const express = require("express");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const { hashPassword, verifyPassword, verifyToken } = require("./auth");

const app = express();

app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

// 1.  the public route

app.get("/", welcome);

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);

app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUserById);
app.post("/api/users", hashPassword, userHandlers.postUser);

/*const isItDwight = (req, res) => {
  if (req.body.email === "dwight@theoffice.com" && req.body.password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

app.post("/api/login", isItDwight);*/

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);

// 2.  then the routes to protect

app.use(verifyToken);

// app.post("/api/movies", movieHandlers.postMovie);
app.put("/api/movies/:id", movieHandlers.updateMovie);
app.delete("/api/movies/:id", movieHandlers.deleteMovie);
// app.put("/api/users/:id", userHandlers.updateUser);
app.delete("/api/users/:id", userHandlers.deleteUser);
app.put("/api/users/:id", hashPassword, userHandlers.updateUser);

app.post("/api/movies", verifyToken, movieHandlers.postMovie);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on ${port}`);
  }
});
