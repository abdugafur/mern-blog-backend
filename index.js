import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import {
  loginValidation,
  postCreateValidation,
  registerValidation,
} from "./validations/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";
import { getUser, login, register } from "./controllers/UserController.js";
import {
  createPost,
  deletePost,
  getAllPosts,
  getOnePost,
  updatePost,
} from "./controllers/PostController.js";
import multer from "multer";
import fs from "fs";

const db =
  "mongodb+srv://abdugafur:abdugafur7777@cluster0.tpnf7zw.mongodb.net/blog?retryWrites=true&w=majority";

mongoose
  .connect(db)
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("Error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync("uploads")) {
      fs.mkdirSync("uploads");
    }
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

app.post("/auth/login", loginValidation, handleValidationErrors, login);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  register
);
app.get("/auth/me", checkAuth, getUser);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", postCreateValidation, getAllPosts);
app.get("/posts/:id", postCreateValidation, getOnePost);
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  createPost
);
app.delete("/posts/:id", checkAuth, postCreateValidation, deletePost);
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  updatePost
);

app.listen(process.env.PORT || 5555, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Server OK");
});
