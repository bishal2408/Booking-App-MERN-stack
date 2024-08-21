import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import cookieParser from "cookie-parser";
import imageDownloader from 'image-downloader'

import { User } from "./models/User.js";

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);

const __dirname = import.meta.dirname 

// middleware for parsing json body
app.use(express.json());
// middleware to read cookies
app.use(cookieParser())
// middleware to display everything inside /uploads directory
app.use('/uploads', express.static(__dirname + '/uploads'))
// middleware to handle CORS policy
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type",
    credentials: true
  })
);

// endpoint to register a user
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });

    res.json(userDoc);

  } catch (error) {
    res.status(422).json(error);
  }
});

// endpoint to login a user using jwt 
app.post('/login', async (req, res) => {
  const {email, password} = req.body

  const userDoc = await User.findOne({email})
  if(userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if(passOk) {
      jwt.sign({
        email: userDoc.email,
        id: userDoc._id,
      }, process.env.JWT_SECRET, {}, (err, token) => {
        if (err) throw err
        res.cookie('token', token).json(userDoc)
      })
    } else {
      res.status(422).json('pass not ok')
    }
  }else {
    res.json("Not found")
  }
})

// endpoint to get user profile
app.get('/profile', (req, res) => {
  const {token} = req.cookies
  if(token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const {name, email, _id} = await User.findById(userData.id)
      res.json({name, email, _id})
    })
  } else {
    res.json(null)
  }
})



app.post('/logout', (req, res) => {
  res.cookie('token', '').json(true)
})


app.post('/upload-by-link', async (req, res) => {
  const {link} = req.body
  const newName = 'photo' + Date.now() + '.jpg'
  await imageDownloader.image({
    url: link,
    dest: __dirname + '/uploads/' + newName,
  })

  res.json(newName)
})

// connecting to mongodb database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully Connected To Database");
    app.listen(process.env.PORT, () => {
      console.log("Node server is running at port: " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error: " + error.message);
  });
