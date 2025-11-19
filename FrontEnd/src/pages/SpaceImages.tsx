import { useState } from 'react';
import './SpaceImages.css';

function SpaceImages() {
  const [date, setDate] = useState('2024-01-01');
  const [zoom, setZoom] = useState(6);
  const [tileX, setTileX] = useState(13);
  const [tileY, setTileY] = useState(36);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${date}/250m/${zoom}/${tileY}/${tileX}.jpg`;

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image. Please try different coordinates or date.');
  };

  const handleLoadImage = () => {
    setLoading(true);
    setError(null);
  };

  return (
    <div className="space-images-page">
      <div className="page-header">
        <h1>🌍 NASA Space Images</h1>
        <p>Explore Earth observation imagery from NASA's Global Imagery Browse Services</p>
      </div>

      <div className="controls-panel">
        <h2>Image Controls</h2>
        <div className="controls-grid">
          <div className="control-group">
            <label htmlFor="date">Date:</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="control-group">
            <label htmlFor="zoom">Zoom Level:</label>
            <input
              id="zoom"
              type="number"
              min="0"
              max="8"
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="control-group">
            <label htmlFor="tileX">Tile X:</label>
            <input
              id="tileX"
              type="number"
              value={tileX}
              onChange={(e) => setTileX(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="control-group">
            <label htmlFor="tileY">Tile Y:</label>
            <input
              id="tileY"
              type="number"
              value={tileY}
              onChange={(e) => setTileY(parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        <button onClick={handleLoadImage} className="load-button">
          Load Image
        </button>
      </div>

      <div className="image-container">
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        <img
          src={tileUrl}
          alt="NASA GIBS Earth Observation Tile"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="space-image"
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>

      <div className="info-box">
        <h3>About This Image</h3>
        <p>
          This image is from NASA's MODIS Terra Corrected Reflectance True Color dataset.
          The image shows Earth observation data for <strong>{date}</strong>.
        </p>
        <p className="attribution">
          Imagery provided by services from NASA's Global Imagery Browse Services (GIBS),
          part of NASA's Earth Science Data and Information System (ESDIS).
        </p>
      </div>
    </div>
  );
}

export default SpaceImages;