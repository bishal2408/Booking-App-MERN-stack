import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from "mongoose";

const app = express();

// middleware for parsing json body
app.use(express.json())

// middleware to handle CORS policy
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: 'Content-Type'
}))


app.get("/", (req, res) => {
  return res.status(200).json({ message: "Welcome to Booking app" });
});

// connecting to mongodb database
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("Successfully Connected To Database");
    app.listen(PORT, () => {
        console.log("Node server is runbing at port: " + PORT);
      });
  })
  .catch((error) => {
    console.log("Error: " + error.message);
  });
