import { useState } from 'react';
import './SpaceImages.css';

function SpaceImages() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [layer, setLayer] = useState('MODIS_Terra_CorrectedReflectance_TrueColor');
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [zoom, setZoom] = useState(6);
  const [tileX, setTileX] = useState(10);
  const [tileY, setTileY] = useState(36);

  // Default values for tile URL (required by GIBS API)
  const projection = 'epsg4326';

  // Some layers need different tile matrix sets, dates, or formats
  const getLayerParams = (layerName: string) => {
    // Temperature and data layers often need "default" date and different resolutions
    if (layerName.includes('Temperature') || layerName.includes('AIRS')) {
      return {
        date: 'default', // Use default date for data layers
        tileMatrixSet: '2km', // Temperature layers often use 2km resolution
        format: 'png'
      };
    }
    if (layerName.includes('BlueMarble')) {
      return {
        date: 'default',
        tileMatrixSet: '250m',
        format: 'png'
      };
    }
    // Default for imagery layers
    return {
      date: '2024-01-01',
      tileMatrixSet: '250m',
      format: 'jpg'
    };
  };

  const layerParams = getLayerParams(layer);
  const format = layerParams.format;

  // The layer variable MUST be in the URL for different images to show
  const tileUrl = `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${layer}/default/${layerParams.date}/${layerParams.tileMatrixSet}/${zoom}/${tileY}/${tileX}.${format}?t=${cacheBuster}`;

  const handleImageLoad = () => {
    setLoading(false);
    setError(null);
  };

  const handleImageError = () => {
    setLoading(false);
    setError('Failed to load image. Please try a different layer.');
  };

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayer(e.target.value);
    setCacheBuster(Date.now()); // Force new request
    setLoading(true);
    setError(null);
  };

  const handleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setZoom(Number(e.target.value));
    setCacheBuster(Date.now());
    setLoading(true);
    setError(null);
  };

  const handleTileXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTileX(Number(e.target.value));
    setCacheBuster(Date.now());
    setLoading(true);
    setError(null);
  };

  const handleTileYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTileY(Number(e.target.value));
    setCacheBuster(Date.now());
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
        <h2>Select Layer</h2>
        <div className="control-group">
          <label htmlFor="layer">Layer:</label>
          <select
            id="layer"
            value={layer}
            onChange={handleLayerChange}
            className="layer-select"
          >
            <option value="MODIS_Terra_CorrectedReflectance_TrueColor">MODIS Terra Corrected Reflectance True Color</option>
            <option value="MODIS_Aqua_CorrectedReflectance_TrueColor">MODIS Aqua Corrected Reflectance True Color</option>
            <option value="VIIRS_SNPP_CorrectedReflectance_TrueColor">VIIRS SNPP Corrected Reflectance True Color</option>
          </select>
        </div>

        <h2>Tile Options</h2>
        <div className="controls-grid">
          <div className="control-group">
            <label htmlFor="zoom">Zoom Level:</label>
            <select
              id="zoom"
              value={zoom}
              onChange={handleZoomChange}
              className="layer-select"
            >
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="tileX">Tile X:</label>
            <input
              id="tileX"
              type="number"
              value={tileX}
              onChange={handleTileXChange}
              min="0"
              max="79"
              className="layer-select"
            />
          </div>

          <div className="control-group">
            <label htmlFor="tileY">Tile Y:</label>
            <input
              id="tileY"
              type="number"
              value={tileY}
              onChange={handleTileYChange}
              min="0"
              max="39"
              className="layer-select"
            />
          </div>
        </div>
      </div>

      <div className="image-container">
        {loading && <div className="loading-spinner">Loading...</div>}
        {error && <div className="error-message">{error}</div>}
        <img
          key={`${layer}-${cacheBuster}`}
          src={tileUrl}
          alt={`NASA GIBS ${layer.replace(/_/g, ' ')}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          className="space-image"
          style={{ display: loading ? 'none' : 'block' }}
        />
      </div>

      <div className="info-box">
        <h3>About This Image</h3>
        <p>
          This image is from NASA's <strong>{layer.replace(/_/g, ' ')}</strong> dataset.
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