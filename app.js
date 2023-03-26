require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
// const secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
const secret = process.env.SECRET;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});


const User = mongoose.model("user", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});




app.route("/register")

.get(function(req, res) {
    res.render("register");
})

.post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    const newUser = new User({
        email: username,
        password: password
    });

    newUser.save()
    .then(function(savedDoc) {
        res.render("secrets");
        console.log(savedDoc);
    })
    .catch(function(err) {
        console.log(err);
    });
});



app.route("/login")

.get( function(req, res) {
    res.render("login");
})

.post(function(req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({email: username})
    .then(function(foundUser) {

        if(foundUser) {

            if (foundUser.password === password) {
                res.render("secrets");
            } else {
                res.send("password is wrong")
            }

        } else {
            res.send("user dosen't exist")
        }
        
    })
    .catch(function(err) {
        console.log(err);
    });
});



app.listen("3000", function() {
    console.log("server started on port 3000");
})