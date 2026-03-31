import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import html2canvas from "html2canvas";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {

    const navigate = useNavigate();

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(5);
  const [paletteName, setPaletteName] = useState("");
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [darkMode, setDarkMode] = useState(
  localStorage.getItem("darkMode") === "true"
);

  const paletteRef = useRef();

  useEffect(() => {
  localStorage.removeItem("palettes"); 
  setSavedPalettes([]);
}, []);

  useEffect(() => {
  localStorage.setItem("darkMode", darkMode);
}, [darkMode]);

const getTextColor = (bg) => {
  const color = bg.substring(1);
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);

  return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? "#000" : "#fff";
};

const hexToRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgb(${r}, ${g}, ${b})`;
};

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

const handleDrop = (e) => {
  e.preventDefault(); 

  const file = e.dataTransfer.files[0];

  if (file) {
    setImage(file);
    setPreview(URL.createObjectURL(file));
  }
};

const handleDragOver = (e) => {
  e.preventDefault();
};

  const uploadImage = async () => {

    if (!image) {
      toast.error("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("count", Number(count) || 5);


    const API_URL = "http://localhost:5000";

    try {
      setLoading(true);
      const res = await fetch("https://color-palette-generator-tfok.onrender.com/extract", {
  method: "POST",
  body: formData
});
      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      let extracted = data.colors || [];

      if (extracted.length > count) {
        extracted = extracted.slice(0, count);
        }

        setColors(extracted);

    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to extract colors. Please try again.");
    }

    finally {
      setLoading(false);
    }
  };

  const downloadPalette = async () => {

    const canvas = await html2canvas(paletteRef.current);
    const link = document.createElement("a");

    link.download = "palette.png";
    link.href = canvas.toDataURL();

    link.click();
  };

  const deletePalette = (index) => {
 
  const updated = savedPalettes.filter((_, i) => i !== index);

  localStorage.setItem("palettes", JSON.stringify(updated));

  setSavedPalettes(updated);
};

  const savePalette = () => {
  if (!paletteName || colors.length === 0) {
  toast.warning("Enter palette name");
  return;
}

  const newPalette = {
    name: paletteName,
    colors: colors
  };

  const existing = JSON.parse(localStorage.getItem("palettes")) || [];

  const updated = [...existing, newPalette];
  localStorage.setItem("palettes", JSON.stringify(updated));

  setSavedPalettes(updated);

  setPaletteName("");
  toast.success("Palette saved!");
};

const handleLogout = () => {
  localStorage.removeItem("isLoggedIn");
  navigate("/register");
};

  return (
    <div className={darkMode ? "container dark" : "container"}>

      <div className="topBar">

  <h1 className="title">🎨 Color Palette Generator</h1>

  <div className="navButtons">

    <button onClick={() => navigate("/gallery")}>
      🎨 Gallery
    </button>

    <button onClick={() => setDarkMode(!darkMode)}>
      {darkMode ? "☀ Light" : "🌙 Dark"}
    </button>

    <button className="logoutBtn" onClick={() => {
      localStorage.removeItem("isLoggedIn");
      navigate("/register");
    }}>
      Logout
    </button>

  </div>

</div>

      <input
      type="text"
      placeholder="Enter palette name"
      value={paletteName}
      onChange={(e) => setPaletteName(e.target.value)}
      />

      <input
      type="number"
      min="1"
      max="20"
      value={count}
      placeholder="Enter number of colors"

  onChange={(e) => {
    let value = e.target.value;

    if (value === "") {
      setCount("");
      return;
    }

    value = Number(value);

    if (value < 1) value = 1;
    if (value > 20) value = 20;

    setCount(value);
  }}
/>
      
      <div
      className="dropZone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >

        <p>Drag & Drop Image OR Click</p>

        <label className="uploadBtn">
            Upload Image
            <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            hidden
            />
            </label>
        </div>

      <div className="buttons">
        <button onClick={uploadImage} disabled={loading}>
          {loading ? "Extracting..." : "Extract Colors"}
          </button>

        {colors.length > 0 && (
          <button onClick={downloadPalette}>
            Download Palette
          </button>
        )}

        <button onClick={savePalette}>
          Save Palette
          </button>
      </div>

      {loading && <div className="loader"></div>}

      {preview && (
        <div className="preview">
          <h3>Image Preview</h3>
          <img src={preview} alt="preview" />
        </div>
      )}

      <div className="palette" ref={paletteRef}>

        {colors.map((color, index) => (
          <div
            key={index}
            className="colorBox"
            style={{ 
              background: color,
              color: getTextColor(color)
            }}
            onClick={() => {
              navigator.clipboard.writeText(color);

              toast.success(
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  {/* 🎨 Color Preview Box */}
                  <div style={{
                    width: "20px",
                    height: "20px",
                    background: color,
                    borderRadius: "4px",
                    border: "1px solid rgba(255,255,255,0.5)"
                    }}></div>

                    {/* Text */}
                    <div>
                      <div><b>{color}</b></div>
                      <div style={{ fontSize: "12px" }}>Copied to clipboard</div>
                      </div>

                      </div>
              );

            }}
          >
            <div>{color}</div>
            <div>{hexToRGB(color)}</div>

          </div>
        ))}

      </div>

      <h3>Saved Palettes</h3>

{savedPalettes.map((p, i) => (
  <div key={i} style={{ marginBottom: "20px" }}>
    
    <h4>{p.name}</h4>

    <button onClick={() => deletePalette(i)}>
      Delete
    </button>

    <div style={{ display: "flex" }}>
      {p.colors.map((c, j) => (
        <div
          key={j}
          style={{
            background: c,
            width: "40px",
            height: "40px"
          }}
        />
      ))}
    </div>

  </div>
))}

<ToastContainer position="top-right" autoClose={2000} />

    </div>
  );
}

export default Home;