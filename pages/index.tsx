import { useState } from 'react';
import Layout from '../components/Layout';
import toast from 'react-hot-toast';

export default function Home() {
  const [landId, setLandId] = useState('');
  const [landInfo, setLandInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const verifyLand = async () => {
    if (!landId) {
      toast.error('Please enter a Land ID');
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
      setLandInfo({
        owner: '0x1234...5678',
        location: 'Lagos, Victoria Island, Plot 45',
        documentHash: 'QmX7s9...3KpZ',
        registered: '2024-12-15'
      });
      setLoading(false);
      toast.success('✅ Land verified successfully');
    }, 1500);
  };

  return (
    <Layout>
      <div className="verify-page">
        <div className="verify-container">
          <div className="verify-card">
            <div className="blockchain-badge">
              🔒 Blockchain Secured
            </div>
            
            <h1 className="verify-title">
              Verify Land<br />Ownership
            </h1>
            
            <p className="verify-subtitle">
              Verify property authenticity instantly using<br />
              decentralized ledger technology.
            </p>

            <div className="input-group">
              <label className="input-label">ENTER LAND ID</label>
              <input
                type="text"
                placeholder="eg. TX-9920-X"
                value={landId}
                onChange={(e) => setLandId(e.target.value)}
                className="verify-input"
              />
            </div>

            <button 
              onClick={verifyLand} 
              disabled={loading} 
              className="verify-button"
            >
              <svg 
                className="verify-icon" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
              {loading ? 'Verifying...' : 'Verify Property'}
            </button>
          </div>
        </div>

        {landInfo && (
          <div className="result-card">
            <h2>✅ Land Information</h2>
            <div className="info-row">
              <strong>Owner:</strong> {landInfo.owner}
            </div>
            <div className="info-row">
              <strong>Location:</strong> {landInfo.location}
            </div>
            <div className="info-row">
              <strong>Document Hash:</strong> {landInfo.documentHash}
            </div>
            <div className="info-row">
              <strong>Registered:</strong> {landInfo.registered}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
