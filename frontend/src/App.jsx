import { useState, useRef, useEffect } from "react";
import "./App.css";
import html2canvas from "html2canvas";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState(5);
  const [paletteName, setPaletteName] = useState("");
  const [savedPalettes, setSavedPalettes] = useState([]);

  const paletteRef = useRef();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("palettes")) || [];
    setSavedPalettes(data);
  }, []);

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
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/extract`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setColors(data.colors);

    } catch (error) {
      console.error("Error:", error);
      alert("❌ Failed to extract colors. Please try again.");
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

  const savePalette = () => {
  if (!paletteName) {
    alert("Enter palette name");
    return;
  }

  const newPalette = {
    name: paletteName,
    colors: colors
  };

  // get old palettes
  const existing = JSON.parse(localStorage.getItem("palettes")) || [];

  // save new palette
  const updated = [...existing, newPalette];
  localStorage.setItem("palettes", JSON.stringify(updated));

  // update UI
  setSavedPalettes(updated);

  // clear input
  setPaletteName("");
};

  return (
    <div className="container">

      <h1>🎨 Color Palette Generator</h1>

      <input
      type="text"
      placeholder="Enter palette name"
      value={paletteName}
      onChange={(e) => setPaletteName(e.target.value)}
      />

      <div
      className="dropZone"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      >

        <p>Drag & Drop Image OR Click</p>

        <input
        type="file"
        accept="image/*"
        onChange={handleImage}
        />
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
              alert("Copied " + color);
            }}
          >
            <div>{color}</div>
            <div>{hexToRGB(color)}</div>

          </div>
        ))}

      </div>

      <h3>Saved Palettes</h3>

      {savedPalettes.map((p, i) => (
        <div key={i}>
          <h4>{p.name}</h4>
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

    </div>
  );
}

export default App;