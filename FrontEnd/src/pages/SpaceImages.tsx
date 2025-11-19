import { useState, useEffect, useRef } from 'react';
import './SpaceImages.css';

function SpaceImages() {
  // Shared layer selection
  const [layer, setLayer] = useState('MODIS_Terra_CorrectedReflectance_TrueColor');
  
  // Single image view state
  const [singleLoading, setSingleLoading] = useState(false);
  const [singleError, setSingleError] = useState<string | null>(null);
  const [singleCacheBuster, setSingleCacheBuster] = useState(Date.now());
  const [singleZoom, setSingleZoom] = useState(6);
  const [singleTileX, setSingleTileX] = useState(10);
  const [singleTileY, setSingleTileY] = useState(36);
  
  // Scrollable view state
  const [scrollableZoom, setScrollableZoom] = useState(6);
  const [scrollableCacheBuster, setScrollableCacheBuster] = useState(Date.now());
  const [currentRow, setCurrentRow] = useState(Math.floor(Math.random() * 40)); // Random row 0-39
  const panoramicContainerRef = useRef<HTMLDivElement>(null);
  
  // Grid view state
  const [gridLoading, setGridLoading] = useState(false);
  const [gridError, setGridError] = useState<string | null>(null);
  const [gridCacheBuster, setGridCacheBuster] = useState(Date.now());
  const [gridZoom, setGridZoom] = useState(6);
  const [gridTileX, setGridTileX] = useState(10);
  const [gridTileY, setGridTileY] = useState(36);
  const [gridSize, setGridSize] = useState(3);
  const [loadedTiles, setLoadedTiles] = useState<Set<string>>(new Set());

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

  // Generate grid of tile coordinates centered on (tileX, tileY)
  const generateTileGrid = (centerX: number, centerY: number, size: number) => {
    const tiles = [];
    const offset = Math.floor(size / 2);
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const xCoord = centerX - offset + x;
        const yCoord = centerY - offset + y;
        
        // Only include valid tiles (within reasonable bounds)
        if (xCoord >= 0 && yCoord >= 0) {
          tiles.push({ x: xCoord, y: yCoord });
        }
      }
    }
    
    return tiles;
  };

  // Build tile URL for given coordinates
  const getSingleTileUrl = (x: number, y: number, zoomLevel: number, cache: number) => {
    const params = getLayerParams(layer);
    return `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${layer}/default/${params.date}/${params.tileMatrixSet}/${zoomLevel}/${y}/${x}.${params.format}?t=${cache}`;
  };

  const getGridTileUrl = (x: number, y: number) => {
    const params = getLayerParams(layer);
    return `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${layer}/default/${params.date}/${params.tileMatrixSet}/${gridZoom}/${y}/${x}.${params.format}?t=${gridCacheBuster}`;
  };

  const getScrollableTileUrl = (x: number, y: number) => {
    const params = getLayerParams(layer);
    return `https://gibs.earthdata.nasa.gov/wmts/${projection}/best/${layer}/default/${params.date}/${params.tileMatrixSet}/${scrollableZoom}/${y}/${x}.${params.format}?t=${scrollableCacheBuster}`;
  };

  // Single image tile URL
  const singleTileUrl = getSingleTileUrl(singleTileX, singleTileY, singleZoom, singleCacheBuster);

  // Generate tiles for current panoramic row
  const generateRowTiles = (rowY: number) => {
    const tiles = [];
    for (let x = 0; x < 80; x++) {
      tiles.push({ x, y: rowY });
    }
    return tiles;
  };

  const currentRowTiles = generateRowTiles(currentRow);
  
  // Grid tiles
  const gridTiles = generateTileGrid(gridTileX, gridTileY, gridSize);

  // Reset grid loaded tiles when grid view changes
  useEffect(() => {
    setLoadedTiles(new Set());
    setGridLoading(true);
    setGridError(null);
  }, [layer, gridZoom, gridTileX, gridTileY, gridSize, gridCacheBuster]);
  
  // Single image handlers
  const handleSingleImageLoad = () => {
    setSingleLoading(false);
    setSingleError(null);
  };

  const handleSingleImageError = () => {
    setSingleLoading(false);
    setSingleError('Failed to load image. Please try a different layer.');
  };

  // Grid view handlers
  const handleGridTileLoad = (tileKey: string) => {
    const newLoaded = new Set(loadedTiles);
    newLoaded.add(tileKey);
    setLoadedTiles(newLoaded);
    
    // All tiles loaded
    if (newLoaded.size === gridTiles.length) {
      setGridLoading(false);
      setGridError(null);
    }
  };

  const handleGridTileError = () => {
    setGridLoading(false);
    setGridError('Failed to load image. Please try a different layer or tile coordinates.');
  };

  const handleLayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLayer(e.target.value);
    setSingleCacheBuster(Date.now());
    setGridCacheBuster(Date.now());
    setScrollableCacheBuster(Date.now());
    setSingleLoading(true);
    setGridLoading(true);
    setSingleError(null);
    setGridError(null);
  };

  const handleNextPanoramic = () => {
    // Select a new random row (0-39)
    const newRow = Math.floor(Math.random() * 40);
    setCurrentRow(newRow);
    setScrollableCacheBuster(Date.now());
    
    // Reset scroll position to the beginning
    if (panoramicContainerRef.current) {
      panoramicContainerRef.current.scrollLeft = 0;
    }
  };

  // Single image handlers
  const handleSingleZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSingleZoom(Number(e.target.value));
    setSingleCacheBuster(Date.now());
    setSingleLoading(true);
    setSingleError(null);
  };

  const handleSingleTileXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingleTileX(Number(e.target.value));
    setSingleCacheBuster(Date.now());
    setSingleLoading(true);
    setSingleError(null);
  };

  const handleSingleTileYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSingleTileY(Number(e.target.value));
    setSingleCacheBuster(Date.now());
    setSingleLoading(true);
    setSingleError(null);
  };

  // Grid view handlers
  const handleGridZoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGridZoom(Number(e.target.value));
    setGridCacheBuster(Date.now());
    setGridLoading(true);
    setGridError(null);
  };

  const handleGridTileXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridTileX(Number(e.target.value));
    setGridCacheBuster(Date.now());
    setGridLoading(true);
    setGridError(null);
  };

  const handleGridTileYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGridTileY(Number(e.target.value));
    setGridCacheBuster(Date.now());
    setGridLoading(true);
    setGridError(null);
  };

  const handleGridSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGridSize(Number(e.target.value));
    setGridCacheBuster(Date.now());
    setGridLoading(true);
    setGridError(null);
  };

  // Lazy loading component for scrollable tiles
  const LazyTile = ({ tile, onLoad }: { tile: { x: number; y: number }, onLoad: () => void }) => {
    const [isVisible, setIsVisible] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setIsVisible(true);
              observer.disconnect();
            }
          });
        },
        { rootMargin: '50px' } // Start loading 50px before tile enters viewport
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }, []);

    return (
      <div ref={imgRef} className="scrollable-tile-wrapper">
        {isVisible ? (
          <img
            src={getScrollableTileUrl(tile.x, tile.y)}
            alt={`Tile ${tile.x}, ${tile.y}`}
            className="scrollable-tile-image"
            onLoad={onLoad}
            onError={() => {
              // Handle error silently
            }}
            loading="lazy"
          />
        ) : (
          <div className="scrollable-tile-placeholder" />
        )}
      </div>
    );
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

      </div>

      {/* Panoramic View */}
      <div className="view-section">
        <h2 className="view-section-title">Panoramic View</h2>
        <div className="controls-panel">
          <h3>View Options</h3>
          <div className="controls-grid">
            <div className="control-group">
              <label htmlFor="scrollableZoom">Zoom Level:</label>
              <select
                id="scrollableZoom"
                value={scrollableZoom}
                onChange={(e) => {
                  setScrollableZoom(Number(e.target.value));
                  setScrollableCacheBuster(Date.now());
                }}
                className="layer-select"
              >
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>
            <div className="control-group">
              <button
                onClick={handleNextPanoramic}
                className="next-panoramic-button"
              >
                Next Panoramic →
              </button>
            </div>
          </div>
          <p style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '1rem', fontSize: '0.9rem' }}>
            Row {currentRow}: Scroll horizontally to explore this complete panoramic. Click "Next Panoramic" to load a new random row.
          </p>
        </div>

        <div className="panoramic-container" ref={panoramicContainerRef}>
          <div className="panoramic-row">
            {currentRowTiles.map((tile) => (
              <LazyTile
                key={`${tile.x}-${tile.y}`}
                tile={tile}
                onLoad={() => {
                  // Tile loaded successfully
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Grid View */}
      <div className="view-section">
        <h2 className="view-section-title">Grid View (Mosaic)</h2>
        <div className="controls-panel">
          <h3>Tile Options</h3>
          <div className="controls-grid">
            <div className="control-group">
              <label htmlFor="gridZoom">Zoom Level:</label>
              <select
                id="gridZoom"
                value={gridZoom}
                onChange={handleGridZoomChange}
                className="layer-select"
              >
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="gridTileX">Tile X (Center):</label>
              <input
                id="gridTileX"
                type="number"
                value={gridTileX}
                onChange={handleGridTileXChange}
                min="0"
                max="79"
                className="layer-select"
              />
            </div>

            <div className="control-group">
              <label htmlFor="gridTileY">Tile Y (Center):</label>
              <input
                id="gridTileY"
                type="number"
                value={gridTileY}
                onChange={handleGridTileYChange}
                min="0"
                max="39"
                className="layer-select"
              />
            </div>

            <div className="control-group">
              <label htmlFor="gridSize">Grid Size:</label>
              <select
                id="gridSize"
                value={gridSize}
                onChange={handleGridSizeChange}
                className="layer-select"
              >
                <option value={3}>3x3 Grid</option>
                <option value={5}>5x5 Grid</option>
                <option value={7}>7x7 Grid</option>
              </select>
            </div>
          </div>
        </div>

        <div className="image-container">
          {gridLoading && (
            <div className="loading-spinner">
              Loading {loadedTiles.size}/{gridTiles.length} tiles...
            </div>
          )}
          {gridError && <div className="error-message">{gridError}</div>}
          <div 
            className="tile-grid"
            style={{
              display: gridLoading && loadedTiles.size === 0 ? 'none' : 'grid',
              gridTemplateColumns: `repeat(${gridSize}, 1fr)`
            }}
          >
            {gridTiles.map((tile) => (
              <img
                key={`${tile.x}-${tile.y}-${layer}-${gridCacheBuster}`}
                src={getGridTileUrl(tile.x, tile.y)}
                alt={`NASA GIBS Tile ${tile.x}, ${tile.y}`}
                onLoad={() => handleGridTileLoad(`${tile.x}-${tile.y}`)}
                onError={handleGridTileError}
                className="tile-image"
              />
            ))}
          </div>
        </div>
      </div>

      {/* Single Image View */}
      <div className="view-section">
        <h2 className="view-section-title">Single Image View</h2>
        <div className="controls-panel">
          <h3>Tile Options</h3>
          <div className="controls-grid">
            <div className="control-group">
              <label htmlFor="singleZoom">Zoom Level:</label>
              <select
                id="singleZoom"
                value={singleZoom}
                onChange={handleSingleZoomChange}
                className="layer-select"
              >
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
              </select>
            </div>

            <div className="control-group">
              <label htmlFor="singleTileX">Tile X:</label>
              <input
                id="singleTileX"
                type="number"
                value={singleTileX}
                onChange={handleSingleTileXChange}
                min="0"
                max="79"
                className="layer-select"
              />
            </div>

            <div className="control-group">
              <label htmlFor="singleTileY">Tile Y:</label>
              <input
                id="singleTileY"
                type="number"
                value={singleTileY}
                onChange={handleSingleTileYChange}
                min="0"
                max="39"
                className="layer-select"
              />
            </div>
          </div>
        </div>

        <div className="image-container">
          {singleLoading && <div className="loading-spinner">Loading...</div>}
          {singleError && <div className="error-message">{singleError}</div>}
          <img
            key={`${layer}-${singleCacheBuster}`}
            src={singleTileUrl}
            alt={`NASA GIBS ${layer.replace(/_/g, ' ')}`}
            onLoad={handleSingleImageLoad}
            onError={handleSingleImageError}
            className="space-image"
            style={{ display: singleLoading ? 'none' : 'block' }}
          />
        </div>
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