const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors"); // middleware between client and server
const path = require("path"); // global module
const fs = require("fs"); // global module

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// MongoDB connection
mongoose
  .connect("mongodb://localhost:27017/image_gallery")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

//// Image Schema
const imageSchema = new mongoose.Schema({
  filename: String,
  path: String,
  contentType: String,
  category: String,
});
const ImageData = mongoose.model("images", imageSchema);

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
console.log("check_Dir", uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Set up multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage }); /// initialize

// Upload Data
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file && !req.body) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const { filename, path, mimetype } = req.file;
    const { category } = req.body;
    console.log(
      `File uploaded: ${filename}, ${path}, ${mimetype}, ${category}`
    );

    const newImage = new ImageData({
      filename,
      path,
      contentType: mimetype,
      category,
    });
    await newImage.save();
    console.log("Image saved to MongoDB:", newImage);
    res.json(newImage);
  } catch (error) {
    console.error("Error saving image to MongoDB", error);
    res.status(500).json({ error: "Failed to save image to database" });
  }
});

// Fetch images
app.get("/images", async (req, res) => {
  try {
    const images = await ImageData.find({});
    res.json(images);
  } catch (error) {
    console.error("Error fetching images from MongoDB", error);
    res.status(500).json({ error: "Failed to fetch images from database" });
  }
});

/// Delete
app.delete("/images/:id", async (req, res) => {
  try {
    const image = await ImageData.findByIdAndDelete(req.params.id);
    console.log("delete_img", image);
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }
    // Remove the file from the filesystem
    fs.unlinkSync(path.join(__dirname, image.path));
    res.json({ message: "Image deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete image" });
  }
});

// Edit
app.put("/images/:id", upload.single("file"), async (req, res) => {
  try {
    const existingImage = await ImageData.findById(req.params.id);
    if (!existingImage) {
      return res.status(404).json({ error: "Image not found" });
    }

    let updatedData = {};
    if (req.file && req.body) {
      let { category } = req.body;
      let { filename, path, mimetype } = req.file;
      updatedData = { filename, path, contentType: mimetype, category };
    }

    let updatedImage = await ImageData.findByIdAndUpdate(
      req.params.id,
      updatedData,
      { new: true }
    ); // { new: true } return only updated data
    console.log("updated data", updatedData);
    console.log("updated Image", updatedImage);

    if (!updatedImage) {
      return res.status(404).json({ error: "Image not found" });
    }
    res.json(updatedImage);

    // Delete old image file from upload folder
    if (existingImage.path) {
      fs.unlinkSync(existingImage.path);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update image" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
