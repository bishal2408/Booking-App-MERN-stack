import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import imageDownloader from "image-downloader";
import multer from "multer";
import fs from "fs";

import { User } from "./models/User.js";
import { Place } from "./models/Place.js";

const app = express();
const bcryptSalt = bcrypt.genSaltSync(10);

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
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const userDoc = await User.findOne({ email });
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        {
          email: userDoc.email,
          id: userDoc._id,
        },
        process.env.JWT_SECRET,
        {},
        (err, token) => {
          if (err) throw err;
          res.cookie("token", token).json(userDoc);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.json("Not found");
  }
});

// endpoint to get user profile
app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else {
    res.json(null);
  }
});

app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

app.post("/upload-by-link", async (req, res) => {
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: __dirname + "/uploads/" + newName,
  });

  res.json(newName);
});

const photosMiddleware = multer({ dest: "uploads/" });
app.post("/upload", photosMiddleware.array("photos", 100), (req, res) => {
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname } = req.files[i];
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path + "." + ext;
    fs.renameSync(path, newPath);
    uploadedFiles.push(newPath.replace("uploads\\", ""));
  }
  res.json(uploadedFiles);
});

app.post("/places", async (req, res) => {
  const { token } = req.cookies;
  const {
    title,
    address,
    addedPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price
  } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const owner = userData.id;
    const placeDoc = await Place.create({
      owner,
      title,
      address,
      photos: addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price
    });

    res.json(placeDoc);
  });
});

app.get("/user-places", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;
    const { id } = userData
    res.json(await Place.find({owner: id}))
  });
});


app.get('/places/:id', async (req, res) => {
  const {id} = req.params
  res.json(await Place.findById(id))
})


app.put('/places', async (req, res) => {
  const { token } = req.cookies;
  const {
    id, title, address, addedPhotos,description,
    perks, extraInfo, checkIn, checkOut, maxGuests, price
  } = req.body;


  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err

    const placeDoc = await Place.findById(id)
    if(userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title, address, photos: addedPhotos, description, perks,
        extraInfo,checkIn,checkOut,maxGuests, price
      })

      await placeDoc.save()
      res.json('ok')
    }
  })

})

app.get('/places', async (req, res) => {
  res.json(await Place.find({}))
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
