import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

// routes
import userRoute from './routes/userRoute.js'
import placesRoute from './routes/placesRoute.js'
import bookingRoute from './routes/bookingRoute.js'
import imageUploadRoute from './routes/imageUploadRoute.js'

const app = express();

const __dirname = import.meta.dirname;

// middleware for parsing json body
app.use(express.json());
// middleware to read cookies
app.use(cookieParser());
// middleware to display everything inside /uploads directory
app.use("/uploads", express.static(__dirname + "/uploads"));
// middleware to handle CORS policy
app.use(
  cors({
    origin: "http://localhost:3000",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

// routes
app.use('', userRoute)
app.use('/places', placesRoute)
app.use('/bookings', bookingRoute)
app.use('', imageUploadRoute)

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
