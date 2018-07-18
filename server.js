const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "ravindrarawat",
    password: "",
    database: "clarifai_app"
  }
});

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(cors());

//-----GET "/"
app.get("/ ", (req, res) => {
  return res.status(200).send("success");
});

//-----GET "/users"
app.get("/users", (req, res) => {
  db.select("*")
    .from("users")
    .where("id", "=", 1)
    .then(data => {
      return res.status(200).json(data[0]);
    })
    .catch(res.status(400).json("Somthing went wrong"));
});

//-----GET "/users/:id"
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id: id })
    .then(user => res.status(200).json(user[0] === undefined ? error : user[0]))
    .catch(err => res.status(404).json("user not found"));
});

//-----POST "/signin"
app.post("/signin", (req, res) => {
  db.select("email", "hash")
    .from("login")
    .where("email", "=", req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash);

      if (isValid) {
        return db
          .select("*")
          .from("users")
          .where("email", "=", req.body.email)
          .then(user => {
            res.status(200).json(user[0]);
          })
          .catch(err => res.status(400).json("unable to get user"));
      }
    })
    .catch(err => res.status(400).json("wrong credentials"));
});

// ------REGISTER "/register"
app.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hash = bcrypt.hashSync(password);
  db.transaction(trx => {
    trx
      .insert({
        hash: hash,
        email: email
      })
      .into("login")
      .returning("email")
      .then(loginEmail => {
        return trx("users")
          .returning("*")
          .insert({
            username: username,
            email: email,
            entries: 0,
            joined: new Date()
          })
          .then(user => res.status(200).json(user[0]));
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("username / email not available"));
});

// PUT "/image"   update entries
app.put("/image", (req, res) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries =>
      res.status(200).json(entries[0] === undefined ? error : entries[0])
    )
    .catch(err => res.status(404).json("unable to get entries"));
});

app.listen(3005, () => {
  console.log(`App listening on port 3005....`);
});
