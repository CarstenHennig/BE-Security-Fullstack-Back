import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connect } from "./libs/database.js";
import { User } from "./models/user.js";
import jwt from "jsonwebtoken";
import multer from "multer";
import { messagerules } from "./validation/messagevalidation.js";
import { validationResult } from "express-validator";
import { File } from "./models/file.js";

dotenv.config();
await connect();
const upload = multer({ dest: "uploads/" });

const app = express();
app.use(express.json());
app.use(cors());

// New endpoint: File upload endpoint
const uploadCheck = upload.fields([{ name: "selectedFile", maxCount: 1 }]);
app.post("/file", uploadCheck, async (req, res) => {
  try {
    await File.create(req.files.selectedfile[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
    console.log(error);
    return;
  }
  res.json({ success: true });
});

// Register new user
app.post("/register", async (req, res) => {
  //   console.log(req.body);
  const user = await User.register(req.body);

  if (!user) {
    return res.status(400).json({ user });
  }

  res.json(201, { success: true });
});

app.post("/login", async (req, res) => {
  const user = await User.login(req.body);

  if (!user) {
    return res.status(400).json({ user });
  }

  // Create JWT token
  const token = jwt.sign({ _id: user._id }, process.env.SECRET);

  res.json({ user, token });
});

const checkLogin = (req, res, next) => {
  const rawJWTHeader = req.headers.authorization;
  console.log(rawJWTHeader);

  if (!rawJWTHeader) {
    return res.sendStatus(401);
  }

  const token = rawJWTHeader.slice(7);
  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err) {
      console.error("jwt error", err.message);
      return res.sendStatus(401);
    }

    console.log(decoded);
    next();
  });
};

const validate = (rules) => {
  const middlewares = rules;

  middlewares.push((req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({ errors: errors.array() });
  });

  return middlewares;
};

const messages = ["First!"];
app.post("/message", checkLogin, validate(messagerules), (req, res) => {
  messages.push(req.body.message);
  res.send(messages);
});

// If all other middleware don't handle the request, this will!
app.use((req, res, next) => {
  res.status(400);
  res.json({ error: "Resource not found" });
});

app.listen(process.env.PORT, () => {
  console.log("Listening on http://localhost:" + process.env.PORT);
});
