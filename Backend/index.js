require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const e = require("cors");
const User = require("./models/user.model");
const TravelStory = require("./models/travelStory.model");
const { authenticateToken } = require("./utils");
const upload = require("./multer");
const path = require("path");
const fs = require("fs");
const { error } = require("console");

mongoose.connect(config.connectionString);

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// All API routes go here
//create account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName || !email || !password) {
    return res
      .status(400)
      .json({ error: true, message: "All Fields are required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res
      .status(400)
      .json({ error: true, message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    fullName,
    email,
    password: hashedPassword,
  });

  await user.save();

  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );
  return res.status(201).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Registration successful",
  });
});

//login
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "User not Found" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(400).json({ message: "Invalid Credentials" });
  }
  const accessToken = jwt.sign(
    {
      userId: user._id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "72h",
    }
  );
  return res.status(200).json({
    error: false,
    user: { fullName: user.fullName, email: user.email },
    accessToken,
    message: "Login successful",
  });
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { userId } = req.user;
  const isUser = await User.findOne({ _id: userId });

  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({ user: isUser, message: "User found" });
});

//Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
  const { title, story, visitedLocation, imageurl, visitedDate } = req.body;
  const { userId } = req.user;

  //validate required fields
  if (!title || !story || !visitedLocation || !imageurl || !visitedDate) {
    return res
      .status(400)
      .json({ message: "All fields are required", error: true });
  }
  //Convert visitedDate to Date object
  const parsedVisitedDate = new Date(parseInt(visitedDate));

  try {
    const travelStory = new TravelStory({
      title,
      story,
      visitedLocation,
      imageurl,
      visitedDate: parsedVisitedDate,
      userId,
    });
    await travelStory.save();
    res.status(201).json({
      story: travelStory,
      message: "Travel Story added successfully",
      error: false,
    });
  } catch (error) {
    res.status(400).json({ error: true, message: error.message });
  }
});

//Get All Travel Stories
app.get("/get-all-travel-stories", authenticateToken, async (req, res) => {
  const { userId } = req.user;

  try {
    const travelStories = await TravelStory.find({ userId: userId }).sort({
      visitedDate: -1,
    });
    res.status(200).json({ stories: travelStories, error: false });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Route to handle image uploads
app.post("/image-upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: true, message: "No image uploaded" });
    }
    const imageurl = `http://localhost:8000/uploads/${req.file.filename}`;

    res.status(201).json({ error: false, imageurl });
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Delete adn image from the uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageurl } = req.query;

  if (!imageurl) {
    return res
      .status(400)
      .json({ error: true, message: "Image URL is required" });
  }

  try {
    //Extract the filename from the imageurl
    const filePath = path.join(__dirname, "uploads", filename);

    //check if the file exists
    if (fs.existsSync(filePath)) {
      //Delete the file from the uploads folder
      fs.unlinkSync(filePath);
      res
        .status(200)
        .json({ error: false, message: "Image deleted Successfully" });
    } else {
      res.status(200).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});

//Serve static files from the uploads folder and assets directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.listen(8000);
module.exports = app;
