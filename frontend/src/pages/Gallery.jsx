import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import html2canvas from "html2canvas";
import { motion } from "framer-motion";
import "react-toastify/dist/ReactToastify.css";

function generateRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";

  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }

  return color;
}

function generatePalettes(count = 50) {
  const palettes = [];

  for (let i = 0; i < count; i++) {
    const colors = [];

    for (let j = 0; j < 5; j++) {
      colors.push(generateRandomColor());
    }

    palettes.push({
      name: `Palette ${i + 1}`,
      colors
    });
  }

  return palettes;
}

function Gallery() {
    const [palettes] = useState([
  {
    name: "Cozy Autumn",
    colors: ["#7f5539", "#b08968", "#ddb892", "#e6ccb2", "#ede0d4"]
  },
  {
    name: "Soft Nude",
    colors: ["#f8edeb", "#fcd5ce", "#fae1dd", "#f9dcc4", "#fec89a"]
  },
  {
    name: "Warm Coffee",
    colors: ["#4b3832", "#854442", "#fff4e6", "#3c2f2f", "#be9b7b"]
  },
  {
    name: "Cool Ocean",
    colors: ["#023e8a", "#0077b6", "#0096c7", "#48cae4", "#90e0ef"]
  },
  {
    name: "Ice Blue",
    colors: ["#caf0f8", "#ade8f4", "#90e0ef", "#00b4d8", "#0077b6"]
  },
  {
    name: "Minimal Nude",
    colors: ["#f5ebe0", "#e3d5ca", "#d6ccc2", "#edede9", "#d5bdaf"]
  },
  {
    name: "Sunset Cozy",
    colors: ["#ffb5a7", "#fcd5ce", "#f8edeb", "#f9dcc4", "#fec89a"]
  },
  {
    name: "Forest Calm",
    colors: ["#344e41", "#3a5a40", "#588157", "#a3b18a", "#dad7cd"]
  },
  {
    name: "Dark Elegant",
    colors: ["#1b263b", "#415a77", "#778da9", "#e0e1dd", "#0d1b2a"]
  },
  {
    name: "Lavender Dream",
    colors: ["#e6e6fa", "#d8bfd8", "#dda0dd", "#ee82ee", "#da70d6"]
  }
]);
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

const [liked, setLiked] = useState(
  JSON.parse(localStorage.getItem("liked")) || []
);


useEffect(() => {
  localStorage.setItem("liked", JSON.stringify(liked));
}, [liked]);


const [showLiked, setShowLiked] = useState(false);

const toggleLike = (index) => {
  if (liked.includes(index)) {
    setLiked(liked.filter((i) => i !== index));
  } else {
    setLiked([...liked, index]);
  }
};

  const navigate = useNavigate();
  const cardRefs = useRef([]);

  useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

  const downloadPalette = async (index) => {
    const canvas = await html2canvas(cardRefs.current[index]);
    const link = document.createElement("a");
    link.download = "palette.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  const filteredPalettes = palettes
  .filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )
  .filter((_, i) =>
    showLiked ? liked.includes(i) : true
  );

  return (
    <div className={darkMode ? "container dark" : "container"}>
      <h1>🎨 Gallery</h1>

      <button onClick={() => navigate("/Home")}>
        ⬅ Back
      </button>

      <button onClick={() => setShowLiked(!showLiked)}>
        {showLiked ? "Show All" : "❤️ Liked Palettes"}
        </button>

      <button onClick={() => setDarkMode(!darkMode)}>
        {darkMode ? "☀ Light" : "🌙 Dark"}
      </button>

      <input
        type="text"
        placeholder="Search palette..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filteredPalettes.length === 0 ? (
        <p>No palettes found 😢</p>
      ) : (
        <div className="galleryGrid">
          {filteredPalettes.map((p, i) => (
            <motion.div
              key={i}
              className="paletteCard"
              ref={(el) => (cardRefs.current[i] = el)}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>{p.name}</h3>

              <div className="colorsRow">
                {p.colors.map((c, j) => (
                  <div
                    key={j}
                    className="colorMini"
                    style={{ background: c }}
                    onClick={() => {
                      navigator.clipboard.writeText(c);
                      toast.success(`${c} copied!`);
                    }}
                  />
                ))}
              </div>

              <div className="cardButtons">
                <button onClick={() => downloadPalette(i)}>
                  Download
                </button>

                <button onClick={() => toggleLike(i)}>
                    {liked.includes(i) ? "❤️ Liked" : "🤍 Like"}
                    </button>

              </div>
            </motion.div>
          ))}
        </div>
      )}

      <ToastContainer position="top-right" autoClose={2000} />
    </div>
  );
}

export default Gallery;