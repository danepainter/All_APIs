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

        <div className="feature-card coming-soon">
          <div className="card-icon">📞</div>
          <h2>Phone Numbers API</h2>
          <p>Manage phone numbers with 2600Hz API integration</p>
          <span className="card-link">Coming Soon</span>
        </div>

        <div className="feature-card coming-soon">
          <div className="card-icon">🔌</div>
          <h2>More APIs</h2>
          <p>Additional API integrations coming soon</p>
          <span className="card-link">Coming Soon</span>
        </div>
      </div>

      <div className="info-section">
        <h2>About This Project</h2>
        <p>AllAPIs is a centralized platform for exploring and integrating with various APIs. Each section provides tools and interfaces to interact with different services.</p>
      </div>
    </div>
  );
}

export default Home;