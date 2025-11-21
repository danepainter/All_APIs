import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>Welcome to AllAPIs</h1>
        <p className="subtitle">Explore various APIs and integrations in one place</p>
      </div>

      <div className="features-grid">
        <Link to="/space-images" className="feature-card">
          <div className="card-icon">🛰️</div>
          <h2>Space Images</h2>
          <p>Browse NASA's Global Imagery Browse Services (GIBS) - access Earth observation imagery and satellite data</p>
          <span className="card-link">Explore →</span>
        </Link>

        <Link to="/dogs" className="feature-card">
          <div className="card-icon">🐶</div>
          <h2>Dogs</h2>
          <p>Get random dog images from the Dog CEO API</p>
          <span className="card-link">Explore →</span>
        </Link>

        <Link to="/color-palette" className="feature-card">
          <h2>Color Palettes</h2>
          <span className="card-link">Explore →</span>
        </Link>
      </div>

      <div className="info-section">
        <h2>About This Project</h2>
        <p>AllAPIs is a centralized platform for exploring and integrating with various APIs. Each section provides tools and interfaces to interact with different services.</p>
      </div>
    </div>
  );
}

export default Home;