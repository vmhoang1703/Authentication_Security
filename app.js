//jshint esversion:6
import 'dotenv/config';
import express from "express";
import ejs from "ejs";
import bodyParser from "body-parser";
import mongoose, { model, mongo } from "mongoose";
import bcrypt from "bcrypt";

const app = express();
const port = 3000;
const saltRounds = 10;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String,
    secret: String
});

const User = mongoose.model("User", userSchema);


app.get("/", async(req, res) => {
    try {
        res.render("home.ejs");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/login", async(req, res) => {
    try {
        res.render("login.ejs");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.get("/register", async(req, res) => {
    try {
        res.render("register.ejs");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/register", async(req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const hashedSecret = bcrypt.hashSync(process.env.SECRET, saltRounds);
        const newUser = new User({
            email: email,
            password: hashedPassword,
            secret: hashedSecret
        });
        await newUser.save();
        res.render("secrets.ejs");
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post("/login", async(req, res) => {
    const email = req.body.username;
    const password = req.body.password;
    try {
        const userFound = await User.findOne({ email: email });
        const resultCompare = bcrypt.compareSync(password, userFound.password);
        if( resultCompare ) {
            res.render("secrets.ejs");
        } else {
            res.redirect("/login");
        }
    } catch (error) {
        res.status(500).send(error);
    }
})

app.listen(port, () => {
    console.log(`Server has started on port ${port}.`);
});