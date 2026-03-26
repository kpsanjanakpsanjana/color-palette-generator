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

  const getTextColor = (bg) => {
    const color = bg.substring(1);
    const r = parseInt(color.substr(0, 2), 16);
    const g = parseInt(color.substr(2, 2), 16);
    const b = parseInt(color.substr(4, 2), 16);

    return (r * 0.299 + g * 0.587 + b * 0.114) > 186 ? "#000" : "#fff";
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

  return (
    <div className="container">

      <h1>🎨 Color Palette Generator</h1>

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
            {color}
          </div>
        ))}

      </div>

    </div>
  );
}

export default App;