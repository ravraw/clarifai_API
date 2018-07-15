const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const database = {
  users: [
    {
      id: "0001",
      name: "john",
      email: "john@gmail.com",
      password: "john123",
      entries: 0,
      joined: new Date()
    },
    {
      id: "0002",
      name: "sam",
      email: "sam@gmail.com",
      password: "sam123",
      entries: 0,
      joined: new Date()
    },
    {
      id: "0003",
      name: "molly",
      email: "molly@gmail.com",
      password: "molly123",
      entries: 0,
      joined: new Date()
    }
  ]
};

//-----GET "/"
app.get("/", (req, res) => {
  res.status(200).send("success");
});

//-----GET "/users"
app.get("/users", (req, res) => {
  res.status(200).send(database.users);
});

//-----GET "/users/:id"
app.get("/users/:id", (req, res) => {
  const { id } = req.params;
  console.log(id);
  database.users.forEach(user => {
    if (user.id === id) {
      res.status(200).json(user);
    }
  });
  res.status(404).json("user not found");
});

//-----POST "/signin"
app.post("/signin", (req, res) => {
  database.users.forEach(user => {
    if (user.email === req.body.email && user.password === req.body.password) {
      res.status(200).json(`welcome ${user.name}`);
    }
  });

  res.status(400).json("Incorrect username or password");
});

// ------REGISTER "/register"

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  database.users.forEach(user => {
    if (user.email === req.body.email) {
      res.status(400).json(`Email already in use`);
    }
    database.users.push({
      id: Math.floor(Math.random() * 10000),
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    });
    res.status(200).json(database.users[database.users.length - 1]);
  });
});

app.listen(3005, () => {
  console.log(`App listening on port 3005....`);
});
