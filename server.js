const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

const userData = [
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
  }
];

//-----GET "/"
app.get("/", (req, res) => {
  res.status(200).send("success");
});

//-----POST "/signin"
app.post("/signin", (req, res) => {
  console.log(req.body);
  if (
    req.body.email === userData[0].email &&
    req.body.password === userData[0].password
  ) {
    res.status(200).json(`welcome ${userData[0].name}`);
  }
  res.status(400).json("Incorrect username or password");
});

// ------REGISTER "/register"

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  userData.push({
    id: "0003",
    name: name,
    email: email,
    password: password,
    entries: 0,
    joined: new Date()
  });
  res.status(200).json(userData[userData.length - 1]);
});

app.listen(3005, () => {
  console.log(`App listening on port 3005....`);
});
