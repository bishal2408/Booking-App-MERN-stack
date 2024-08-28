import express from "express";
import "dotenv/config";
import jwt from "jsonwebtoken";

import { Place } from "../models/Place.js";

const router = express.Router();

const getUserDataFromReq = (req) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      req.cookies.token,
      process.env.JWT_SECRET,
      {},
      async (err, userData) => {
        if (err) throw err;
        resolve(userData);
      }
    );
  });
};

// endpoint to create a place
router.post("/", async (req, res) => {
  try {
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
      price,
    } = req.body;

    const userData = await getUserDataFromReq(req);
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
      price,
    });

    res.json(placeDoc);
  } catch (error) {
    res.status(422).json(error);
  }
});

// enpoint to get places of looged in user
router.get("/user-places", async (req, res) => {
  try {
    const userData = await getUserDataFromReq(req);
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  } catch (error) {
    res.status(422).json(error);
  }
});

// endpoint to get place data of each individual place
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    res.json(await Place.findById(id));
  } catch (error) {
    res.status(422).json(error);
  }
});

// enpoint to update a place
router.put("", async (req, res) => {
  try {
    const {
      id,
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    } = req.body;

    const userData = await getUserDataFromReq(req);

    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      await placeDoc.save();
      res.json("ok");
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

// endpoint to get all the places
router.get("", async (req, res) => {
  try {
    res.json(await Place.find({}));
  } catch (error) {
    res.status(422).json(error);
  }
});

export default router;
