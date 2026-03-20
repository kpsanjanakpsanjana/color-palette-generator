const express = require("express");
const multer = require("multer");
const cors = require("cors");
const getColors = require("get-image-colors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());

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

    const colors = await getColors(req.file.path);

    const hexColors = colors.map(c => c.hex());

    fs.unlinkSync(req.file.path);

    res.json({ colors: hexColors });

  } catch (error) {

    console.error(error);
    res.status(500).json({ error: "Color extraction failed" });

  }
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});