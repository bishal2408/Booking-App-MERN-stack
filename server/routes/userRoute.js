import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
// import "dotenv/config";

const bcryptSalt = bcrypt.genSaltSync(10);
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

// endpoint to register a user
router.post("/register", async (req, res) => {
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

// endoint to login user
router.post("/login", async (req, res) => {
  try {
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
  } catch (error) {
    res.status(422).json(error);
  }
});

// endpoint to get user profile
router.get("/profile", async (req, res) => {
  try {
    const { token } = req.cookies;
    if (token) {
      const userData = await getUserDataFromReq(req);
      const { name, email, _id } = await User.findById(userData.id);
      res.json({ name, email, _id });
    } else {
      res.json(null);
    }
  } catch (error) {
    res.status(422).json(error);
  }
});

// end point to logout user
router.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

export default router;
