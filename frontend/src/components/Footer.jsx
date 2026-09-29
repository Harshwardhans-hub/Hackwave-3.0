import React from 'react';
import './Footer.css';

export default function Footer({ onNavigate }) {
  return (
    <footer className="footer" id="footer">
      <div className="footer__inner container">
        <div className="footer__bottom">
          <p className="footer__copyright">
            © 2026 Sahayak Rail · Ministry of Railways · Hackwave 3.0
          </p>
          <div className="footer__badges">
            <span className="footer__badge">Hackwave 3.0</span>
            <span className="footer__badge">Indian Railways</span>
            <span className="footer__badge">OR-Tools CP-SAT</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
