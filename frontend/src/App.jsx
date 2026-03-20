import { useState, useRef } from "react";
import "./App.css";
import html2canvas from "html2canvas";

function App() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [colors, setColors] = useState([]);

  const paletteRef = useRef();

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);

    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const uploadImage = async () => {

    if (!image) {
      alert("Please select an image first");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://localhost:5000/extract", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setColors(data.colors);
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

      <input type="file" accept="image/*" onChange={handleImage} />

      <div className="buttons">
        <button onClick={uploadImage}>Extract Colors</button>

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
            style={{ background: color }}
            onClick={() => navigator.clipboard.writeText(color)}
          >
            {color}
          </div>
        ))}

      </div>

    </div>
  );
}

export default App;