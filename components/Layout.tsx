import Link from 'next/link';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <nav className="navbar">
        <div className="nav-container">
          <Link href="/" className="logo">
            <img src="/logo.png" alt="Terratrust Logo" className="logo-img" />
          </Link>

          <div className="nav-links">
            <Link href="/" className="nav-link">Verify Land</Link>
            <Link href="/register" className="nav-link">Register Land</Link>
            <Link href="/transfer" className="nav-link">Transfer</Link>
            <Link href="/dashboard" className="nav-link">Dashboard</Link>
            <Link href="/about" className="nav-link">About</Link>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>🛡️ Terratrust</h3>
            <p>Securing land ownership with blockchain technology</p>
          </div>

          <div className="footer-section">
            <h4>Product</h4>
            <Link href="/">Verify Land</Link>
            <Link href="/register">Register Land</Link>
            <Link href="/dashboard">Dashboard</Link>
          </div>

          <div className="footer-section">
            <h4>Company</h4>
            <Link href="/about">About Us</Link>
            <Link href="/terms">Terms of Service</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="footer-section">
            <h4>Connect</h4>
            <a href="https://twitter.com/terratrust" target="_blank" rel="noopener noreferrer">
              𝕏 Twitter
            </a>
            <a href="https://github.com/terratrust" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <a href="https://discord.gg/terratrust" target="_blank" rel="noopener noreferrer">
              Discord
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2026 Terratrust. Built on Starknet.</p>
        </div>
      </footer>
    </div>
  );
}
