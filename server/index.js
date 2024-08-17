import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'

import { User } from "./models/User.js";

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'jahdkhsakkddjaskdnkj29'

// middleware for parsing json body
app.use(express.json());

// middleware to handle CORS policy
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: "Content-Type",
    credentials: true
  })
);

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

app.post('/login', async (req, res) => {
  const {email, password} = req.body

  const userDoc = await User.findOne({email})
  if(userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password)
    if(passOk) {
      jwt.sign({email: userDoc.email, id: userDoc._id}, jwtSecret, {}, (err, token) => {
        if (err) throw err
        res.cookie('token', token).json('pass ok')
      })
    } else {
      res.status(422).json('pass not ok')
    }
  }else {
    res.json("Not found")
  }
})

// connecting to mongodb database
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Successfully Connected To Database");
    app.listen(process.env.PORT, () => {
      console.log("Node server is runbing at port: " + process.env.PORT);
    });
  })
  .catch((error) => {
    console.log("Error: " + error.message);
  });
