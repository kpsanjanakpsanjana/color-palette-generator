const express = require("express");
const multer = require("multer");
const cors = require("cors");
const getColors = require("get-image-colors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors({ origin: "*" }));

const uploadPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
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

const upload = multer({
  storage: storage,

  fileFilter: (req, file, cb) => {
    
    if (file.mimetype.startsWith("image/")) {
      cb(null, true); 
    } else {
      cb(new Error("Only image files are allowed"), false); 
    }
  }
});

app.post("/extract", (req, res) => {

  upload.single("image")(req, res, async (err) => {

    if (err) {
      return res.status(400).json({ error: err.message });
    }

    try {
      const count = parseInt(req.body.count) || 5;

      const colors = await getColors(req.file.path, {
        count: count + 5
        });

      const hexColors = colors
      .slice(0, count)
      .map(c => c.hex());

      fs.unlink(req.file.path, () => {});

      res.json({ colors: hexColors });

    } catch (error) {
      res.status(500).json({ error: "Color extraction failed" });
    }

  });

});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});