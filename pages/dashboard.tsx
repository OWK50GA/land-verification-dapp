import Layout from '../components/Layout';

export default function Dashboard() {
  const sampleLands = [
    {
      id: '12345',
      location: 'Lagos, Victoria Island, Plot 45',
      registeredDate: '2024-12-15',
      documentHash: 'QmX7s9...3KpZ',
      status: 'Verified'
    },
    {
      id: '67890',
      location: 'Abuja, Maitama District, Plot 12',
      registeredDate: '2025-01-10',
      documentHash: 'QmY9t2...7LmA',
      status: 'Verified'
    },
  ];

  return (
    <Layout>
      <div className="container">
        <div className="dashboard-header">
          <h1>Sample Land Registry</h1>
          <p className="subtitle">Example registered lands on Terratrust</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">🏡</div>
            <div className="stat-value">{sampleLands.length}</div>
            <div className="stat-label">Sample Lands</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-value">{sampleLands.filter(l => l.status === 'Verified').length}</div>
            <div className="stat-label">Verified</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🇳🇬</div>
            <div className="stat-value">Nigeria</div>
            <div className="stat-label">Primary Market</div>
          </div>
        </div>

        <div className="lands-section">
          <div className="section-header">
            <h2>Registered Lands</h2>
          </div>
          
          <div className="lands-grid">
            {sampleLands.map(land => (
              <div key={land.id} className="land-card">
                <div className="land-header">
                  <span className="land-id">Land #{land.id}</span>
                  <span className="status-badge verified">
                    {land.status}
                  </span>
                </div>
                <div className="land-body">
                  <div className="land-info">
                    <strong>📍 Location:</strong>
                    <span>{land.location}</span>
                  </div>
                  <div className="land-info">
                    <strong>📅 Registered:</strong>
                    <span>{land.registeredDate}</span>
                  </div>
                  <div className="land-info">
                    <strong>📄 Document:</strong>
                    <span className="hash">{land.documentHash}</span>
                  </div>
                </div>
                <div className="land-actions">
                  <a 
                    href={`https://gateway.pinata.cloud/ipfs/${land.documentHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="button-outline-small"
                  >
                    View Docs
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
