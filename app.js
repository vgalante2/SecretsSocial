//jshint esversion:6 + BOILERPLATES
require('dotenv').config()
const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

console.log(process.env.SECRET);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

// ____________________________________________________________________________

// CONNECTION

mongoose.connect("mongodb://127.0.0.1:27017/userDB", { useNewUrlParser: true });

// ____________________________________________________________________________

// SCHEMA

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});


userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ["password"] });



const User = new mongoose.model("User", userSchema)




// ____________________________________________________________________________
// Routes


app.get("/", async function (req, res){
res.render("home")
});

app.get("/login", async function (req, res){
res.render("login")
});

app.get("/register", async function (req, res){

res.render("register")
});



app.post("/register", async function(req, res){
try{
  const newUser = new User ({
    email: req.body.username,
    password: req.body.password
  });
  if (newUser){
  newUser.save();
  res.render("secrets");
  }
} catch (err) {
  console.log(err);
}
});

app.post("/login", async function (req, res) {
  try{
const username = req.body.username;
const password = req.body.password;
const foundUser = await User.findOne({email: username});
if (foundUser) {
  if (foundUser.password === password) {
    res.render("secrets");
  }
}
} catch (err){
  console.log(err);
}
});










// ____________________________________________________________________________

//  LISTENING PORT

app.listen(3000, async function (req, res){
  console.log("Youre the man cenzo, dont forget... btw youre connected");
});
