const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
  currentUser: {
    id: "",
    name: "",
    email: "",
    entries: 0
  },
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
app.get("/ ", (req, res) => {
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
      database.currentUser = {
        ...database.currentUser,
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries
      };
      res.status(200).json(database.currentUser);
    }
  });

  res.status(400).json("Incorrect username or password");
});

// ------REGISTER "/register"
function userExist(email) {
  let result = false;
  database.users.forEach(user => {
    if (user.email === email) {
      result = true;
    }
  });
  return result;
}

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  if (userExist(email)) {
    return res.status(400).json("EMAIL ALREADY EXIST ");
  } else {
    let newUser = {
      id: Math.floor(Math.random() * 10000),
      name: name,
      email: email,
      password: password,
      entries: 0,
      joined: new Date()
    };
    database.users.push(newUser);
    return res.status(200).json(database.users[database.users.length - 1]);
  }
});

// PUT "/image"   update entries
app.put("/image", (req, res) => {
  const { id } = req.body;
  console.log(id);
  database.users.forEach(user => {
    if (user.id === id) {
      user.entries++;
      res.status(200).json(user.entries);
    }
  });
  res.status(404).json("user not found");
});

app.listen(3005, () => {
  console.log(`App listening on port 3005....`);
});
