import React from 'react';
import IndiaMap from '../components/IndiaMap';
import Footer from '../components/Footer';
import './LandingPage.css';

export default function LandingPage({ onNavigate, onQuickRoleLogin }) {
  const handleQuickRole = (role, dept, name) => {
    if (onQuickRoleLogin) {
      onQuickRoleLogin({ role, department: dept, name });
    } else if (onNavigate) {
      onNavigate('login');
    }
  };

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="landing-hero__inner">
          <div className="landing-hero__content">
            <div className="landing-badge">
              <span className="landing-badge__dot"></span>
              MINISTRY OF RAILWAYS • HACKWAVE 3.0
            </div>

            <h1 className="landing-title">
              Intelligent Block Scheduling for <span>Indian Railways</span>
            </h1>

            <p className="landing-subtitle">
              <strong>Sahayak Rail (सहायक रेल)</strong> unifies <strong>Permanent Way (P-Way)</strong>, 
              <strong>Signal & Telecom (S&T)</strong>, and <strong>Traction Distribution (TRD)</strong> onto a single 
              intelligent decision-support plane. Moving from 3+ hours of manual phone memos to seconds using 
              Constraint Programming (Google OR-Tools CP-SAT).
            </p>

            <div className="landing-cta-group">
              <button 
                className="landing-btn-primary"
                onClick={() => onNavigate('login')}
                id="landing-hero-login-btn"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                Officer & Department Login
              </button>

              <button 
                className="landing-btn-secondary"
                onClick={() => {
                  const el = document.getElementById('usps-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                Why Sahayak Rail Wins
              </button>
            </div>
          </div>

          {/* Right Hero Card with Key IR Stats and 1-Click Role Access */}
          <div className="landing-hero__card">
            <div className="landing-hero__card-header">
              <span className="landing-hero__card-title">Operational Scope (IR Network)</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>CRIS / RDSO Grounded</span>
            </div>

            <div className="landing-hero__stats-grid">
              <div className="landing-stat-box">
                <span className="landing-stat-num">68,000+</span>
                <span className="landing-stat-label">Route Kilometers</span>
              </div>
              <div className="landing-stat-box">
                <span className="landing-stat-num">13,000+</span>
                <span className="landing-stat-label">Daily Trains Protected</span>
              </div>
              <div className="landing-stat-box">
                <span className="landing-stat-num">60%</span>
                <span className="landing-stat-label">Track Closure Reduction</span>
              </div>
              <div className="landing-stat-box">
                <span className="landing-stat-num">2G GSM</span>
                <span className="landing-stat-label">Failsafe SMS Dispatch</span>
              </div>
            </div>

            <div className="landing-quick-roles">
              <div className="landing-quick-roles-title">⚡ 1-Click Evaluation Access for Judges</div>
              <div className="landing-quick-roles-btns">
                <button 
                  className="landing-role-pill"
                  onClick={() => handleQuickRole('Section Controller', 'Operating (Traffic)', 'Chief Controller A. K. Verma')}
                >
                  <span>👨‍✈️</span> Controller SCR
                </button>
                <button 
                  className="landing-role-pill"
                  onClick={() => handleQuickRole('SSE (P-Way)', 'Engineering (P-Way)', 'SSE/P-Way R. K. Sharma')}
                >
                  <span>🛤️</span> SSE P-Way
                </button>
                <button 
                  className="landing-role-pill"
                  onClick={() => handleQuickRole('SSE (S&T)', 'Signal & Telecom', 'SSE/Signals M. Patel')}
                >
                  <span>🚦</span> SSE S&T
                </button>
                <button 
                  className="landing-role-pill"
                  onClick={() => handleQuickRole('SSE (TRD)', 'Electrical (TRD / OHE)', 'SSE/TRD K. Deshmukh')}
                >
                  <span>⚡</span> SSE Electrical
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Winning USPs Section */}
      <section className="landing-section" id="usps-section">
        <div className="landing-section-header">
          <span className="landing-section-tag">Competitor Gap Analysis • Operational Realities</span>
          <h2 className="landing-section-title">The Four Operational Pillars Nobody Else Built</h2>
          <p className="landing-section-desc">
            Standard mathematical optimization is table stakes. Sahayak Rail wins by solving 
            the real-world ground realities of Indian Railways operations that other teams overlooked.
          </p>
        </div>

        <div className="landing-usps-grid">
          {/* USP #1 */}
          <div className="landing-usp-card">
            <span className="landing-usp-badge landing-usp-badge--priority">USP #1 • TOP PRIORITY</span>
            <div className="landing-usp-icon">📱</div>
            <h3 className="landing-usp-heading">Low-Connectivity 2G SMS Dispatch</h3>
            <p className="landing-usp-text">
              Over 40% of track maintenance occurs in remote ghats or rural corridors with zero 4G/5G data. 
              Gangmen and JEs submit block requests and clearance tokens over standard GSM SMS (₹0.15/SMS), 
              receiving cryptographically verified Private Numbers and Form T/348M permits.
            </p>
            <div className="landing-usp-footer">
              <span>Works on 2G feature phones</span> →
            </div>
          </div>

          {/* USP #2 */}
          <div className="landing-usp-card">
            <span className="landing-usp-badge landing-usp-badge--mandated">USP #2 • PS-MANDATED</span>
            <div className="landing-usp-icon">📦</div>
            <h3 className="landing-usp-heading">Freight & Goods-Train Forecaster</h3>
            <p className="landing-usp-text">
              While passenger trains have fixed timetables, freight movements are dynamic. We ingest 
              real data.gov.in monthly freight commodity streams and COA occupancy to forecast goods-train 
              density and expose conflict-free "Calm Maintenance Windows."
            </p>
            <div className="landing-usp-footer">
              <span>Preserves freight revenue</span> →
            </div>
          </div>

          {/* USP #3 */}
          <div className="landing-usp-card">
            <span className="landing-usp-badge landing-usp-badge--weather">USP #3 • REALITY-GROUNDED</span>
            <div className="landing-usp-icon">🌧️</div>
            <h3 className="landing-usp-heading">Monsoon & Weather Risk Adaptation</h3>
            <p className="landing-usp-text">
              Monsoons, bridge scours, and summer rail temperatures exceeding 55°C regularly cause rail kinks 
              and washouts. Ingesting IMD live alerts automatically reschedules high-risk outdoor tamping to 
              safe windows or sheltered station yards.
            </p>
            <div className="landing-usp-footer">
              <span>IRPWM Para 601–620 aligned</span> →
            </div>
          </div>

          {/* USP #4 */}
          <div className="landing-usp-card">
            <span className="landing-usp-badge landing-usp-badge--bidding">USP #4 • COLLABORATIVE</span>
            <div className="landing-usp-icon">🤝</div>
            <h3 className="landing-usp-heading">Cross-Department Bidding Engine</h3>
            <p className="landing-usp-text">
              Instead of departments independently fighting for corridor possessions in BDMS, departments 
              digitally bid for required track-hours. The CP-SAT engine dynamically bundles overlapping needs 
              into single synchronized shadow blocks.
            </p>
            <div className="landing-usp-footer">
              <span>Saves 3–4 hrs per possession</span> →
            </div>
          </div>
        </div>

        {/* Callout Action Banner */}
        <div className="landing-callout">
          <div>
            <div className="landing-callout__title">Ready to explore the active corridor schedules?</div>
            <div className="landing-callout__sub">
              Access the Section Controller Command Center, OR-Tools Optimizer, and 2G SMS Terminal.
            </div>
          </div>
          <button 
            className="landing-btn-primary"
            onClick={() => onNavigate('login')}
          >
            Access Railway Portal →
          </button>
        </div>
      </section>

      {/* Network Map Section */}
      <section className="landing-section" style={{ paddingTop: 0 }}>
        <div className="landing-section-header">
          <span className="landing-section-tag">GIS Rail Corridor Network</span>
          <h2 className="landing-section-title">National Corridor Coverage</h2>
          <p className="landing-section-desc">
            Interactive GIS map covering 26 major junction nodes and high-density Golden Quadrilateral 
            trunk corridors configured for automated block deconfliction.
          </p>
        </div>

        <IndiaMap />
      </section>

      {/* Footer */}
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
