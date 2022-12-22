const express = require("express")
const bcrypt = require("bcrypt")
const User = require('../models/userModal')
const jwt = require('jsonwebtoken')
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    const userExists = await User.findOne({ email });
    const userNameExists = await User.findOne({ userName });
    if (userExists)
      return res.status(400).json({ message: "Mail already exists" });
    if (userNameExists)
      return res.status(400).json({ message: "Username already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const createdUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });
    delete createdUser.password
    return res.status(201).json(createdUser);
  } catch {
    console.log("create user failed");
  }
});

router.post("/login", async (req, res) => {
  try {
    const { password, userName, email } = req.body;
    const user = await User.findOne({ userName });
    if (!user) return res.status(400).json({ massege: "user does not exist" });

    const userPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!userPasswordCorrect) return res.status(400).json({ massege: "Wrong Password" });

    const token = jwt.sign({
      mail: email,
      exp: Math.floor(Date.now() / 1000) + 60
    }, 'secretKey')

    return res.status(200).json({ user, massege: "Authentication successful", token });
  } catch (error) {
    return res.status(400).json({ message: error.massege });
  }
});

router.get("/getAllUsers", async (req, res) => {
  return new Promise((resolve, reject) => {
    User.find().then(result => {
      res.send(result)
    }).catch(err => {
      resolve(err)
    })
  })
})

module.exports = router
