import { useState, useEffect } from 'react'
import './ColorPalette.css'
 

//Type definitions
interface ColorPaletteRequest {
    model : string;
    input: (number[] | string) [];
}

interface ColorPaletteResponse {
    result: number[][];
}

type Color = [number, number, number]; //RGB value tuple

//helper function to  convert rgb to hex
const rgbToHex = (r: number, g: number, b: number): string => {
  return "#" + [r, g, b].map(x => {
    const hex=x.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }).join("");
};


function ColorPalette() {

    const [palette, setPalette] = useState<Color[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchColorPalette = async() => {
      const url = "http://localhost:5000/api/colormind";

      const data: ColorPaletteRequest = {
          model: "default", 
          input: [[44, 34, 44], [90, 83, 82], "N", "N", "N"]
      };

      setLoading(true);
      setError(null);

      try {
          const response = await fetch(url, {
              method: "POST",
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
          });

          if(!response.ok) {
              throw new Error(`HTTP Error! status: ${response.status}`);
          }

          const result: ColorPaletteResponse = await response.json();
          setPalette(result.result as Color[]);
      }   catch (err) {
          setError(err instanceof Error ? err.message : 'Failed to fetch color palette');
          console.error('Error fetching color palette:', err);
      }   finally {
              setLoading(false);
      }
  };

    useEffect(() => {
        fetchColorPalette();
    }, []);












    return (
      <div className="color-palette-page">
        <div className="page-header">
          <h1>Color Palette</h1>
        </div>
        
        {loading && <p className="loading-message">Loading palette...</p>}
        {error && <p className="error-message">Error: {error}</p>}
        
        {palette && (
          <div className="palette-container">
            {palette.map((color, index) => {
              const hex = rgbToHex(color[0], color[1], color[2]);
              return (
                <div 
                  key={index} 
                  className="color-card"
                  style={{ backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})` }}
                >
                  <div className="color-card-content">
                    <div className="color-hex">{hex.toUpperCase()}</div>
                    <div className="color-rgb">
                      RGB({color[0]}, {color[1]}, {color[2]})
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
}

export default ColorPalette;