const express = require("express");
const multer = require("multer");
const cors = require("cors");
const getColors = require("get-image-colors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  }
});

const upload = multer({ storage: storage });

app.post("/extract", upload.single("image"), async (req, res) => {
  try {

    console.log("Image received:", req.file.filename);

    const count = parseInt(req.body.count) || 5;
    const colors = await getColors(req.file.path, {
      count: count
      });

    const hexColors = colors.map(c => c.hex());

    fs.unlink(req.file.path, (err) => {
      if (err) console.error("Delete error:", err);
    });

    res.json({ colors: hexColors });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Color extraction failed" });

  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});