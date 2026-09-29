import React, { useState } from 'react';
import vandeBharatImg from '../assets/vande_bharat_hero.jpg';
import './Hero.css';

export default function Hero({ onNavigate, isLoggedIn = false }) {
  const [fromStation, setFromStation] = useState('NDLS - New Delhi Div');
  const [toStation, setToStation] = useState('AGC - Agra Cantt Sec');
  const [journeyDate, setJourneyDate] = useState('2026-09-10');
  const [department, setDepartment] = useState('Multi-Dept');
  const [horizon, setHorizon] = useState('24h');
  const [searchFeedback, setSearchFeedback] = useState('');
  const [isSwapping, setIsSwapping] = useState(false);

  const handleSwap = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSwapping(true);
    setFromStation((prevFrom) => {
      setToStation(prevFrom);
      return toStation;
    });
    setTimeout(() => setIsSwapping(false), 350);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!isLoggedIn) return;
    setSearchFeedback(`Optimizing multi-department corridor blocks for ${fromStation} → ${toStation}...`);
    setTimeout(() => {
      setSearchFeedback('');
      if (onNavigate) {
        onNavigate('optimizer');
      } else {
        window.location.hash = 'optimizer';
      }
    }, 600);
  };

  const handleLiveOccupancy = () => {
    if (!isLoggedIn) return;
    if (onNavigate) {
      onNavigate('dashboard');
    } else {
      window.location.hash = 'dashboard';
    }
  };

  const handleFieldTerminal = () => {
    if (!isLoggedIn) return;
    if (onNavigate) {
      onNavigate('field-dispatch');
    } else {
      window.location.hash = 'field-dispatch';
    }
  };

  return (
    <section className="irctc-hero" id="hero">
      <div className="irctc-hero-inner container">
        {/* Top Hero Banner Section with Vande Bharat Train */}
        <div className="irctc-hero-top">
          <div className="irctc-hero-text">
            <h1 className="irctc-hero-title">
              Block Planning, <span className="irctc-highlight-orange">made intelligent</span>
            </h1>
            <p className="irctc-hero-subtitle">
              Sahayak Rail — AI-Powered Automatic Block Planning for Indian Railways
              <span className="irctc-hero-badge">CP-SAT SOLVER · MINISTRY OF RAILWAYS · HACKWAVE 3.0</span>
            </p>
          </div>

          <div className="irctc-hero-train-visual">
            <div className="irctc-hero-train-track"></div>
            <img
              src={vandeBharatImg}
              alt="Indian Railways Vande Bharat High Speed Train"
              className="irctc-hero-train-img"
            />
          </div>
        </div>

        {/* Floating IRCTC Search & Action Card (Image 1 Theme with Railway Engineering Parameters) */}
        <div className="irctc-search-card">
          <form onSubmit={handleSearch} className="irctc-search-form">
            {/* Left Form Grid */}
            <div className="irctc-search-grid">
              {/* Row 1: From, Swap, To, Date */}
              <div className="irctc-search-row irctc-search-row--top">
                {/* From Corridor / Division */}
                <div className="irctc-search-field">
                  <div className="irctc-field-icon irctc-icon-circle">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="9"></circle>
                      <circle cx="12" cy="12" r="3" fill="#005494"></circle>
                    </svg>
                  </div>
                  <div className="irctc-field-content">
                    <label className="irctc-field-label">From Section</label>
                    <input
                      type="text"
                      list="rail-sections-from"
                      value={fromStation}
                      onChange={(e) => setFromStation(e.target.value)}
                      placeholder="Select Division / Station"
                      className="irctc-field-input"
                      required
                    />
                    <datalist id="rail-sections-from">
                      <option value="NDLS - New Delhi Div" />
                      <option value="AGC - Agra Cantt Sec" />
                      <option value="CNB - Kanpur Central" />
                      <option value="ALD - Prayagraj Jn" />
                      <option value="MGS - Pt. DD Upadhyaya" />
                      <option value="BPL - Bhopal Div" />
                      <option value="JHS - Jhansi Sec" />
                      <option value="GWL - Gwalior Sec" />
                    </datalist>
                  </div>
                </div>

                {/* Swap Button (Image 4) */}
                <button
                  type="button"
                  className={`irctc-swap-btn ${isSwapping ? 'swapping' : ''}`}
                  onClick={handleSwap}
                  title="Swap From and To Sections"
                  aria-label="Swap Corridor"
                  id="swap-corridor-btn"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 8h16M16 4l4 4-4 4M20 16H4M8 12l-4 4 4 4" />
                  </svg>
                </button>

                {/* To Corridor / Division */}
                <div className="irctc-search-field">
                  <div className="irctc-field-icon irctc-icon-pin">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <div className="irctc-field-content">
                    <label className="irctc-field-label">To Section</label>
                    <input
                      type="text"
                      list="rail-sections-to"
                      value={toStation}
                      onChange={(e) => setToStation(e.target.value)}
                      placeholder="Select Division / Section"
                      className="irctc-field-input"
                      required
                    />
                    <datalist id="rail-sections-to">
                      <option value="AGC - Agra Cantt Sec" />
                      <option value="NDLS - New Delhi Div" />
                      <option value="CNB - Kanpur Central" />
                      <option value="ALD - Prayagraj Jn" />
                      <option value="MGS - Pt. DD Upadhyaya" />
                      <option value="BPL - Bhopal Div" />
                      <option value="JHS - Jhansi Sec" />
                      <option value="GWL - Gwalior Sec" />
                    </datalist>
                  </div>
                </div>

                {/* Date */}
                <div className="irctc-search-field irctc-search-field--date">
                  <div className="irctc-field-content">
                    <label className="irctc-field-label">Block Date</label>
                    <input
                      type="date"
                      value={journeyDate}
                      onChange={(e) => setJourneyDate(e.target.value)}
                      className="irctc-field-input irctc-field-input--date"
                      required
                    />
                  </div>
                  <div className="irctc-field-icon-right">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Row 2: Department, Multi-Horizon Planning, Search Button */}
              <div className="irctc-search-row irctc-search-row--bottom">
                {/* Department Dropdown (TMS, SMMS, TDMS) */}
                <div className="irctc-search-field">
                  <div className="irctc-field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                      <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                  </div>
                  <div className="irctc-field-content">
                    <label className="irctc-field-label">Department</label>
                    <select
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="irctc-field-select"
                    >
                      <option value="Multi-Dept">Multi-Department (Joint Shadow Block)</option>
                      <option value="Engineering">Engineering (TMS / P-Way Track)</option>
                      <option value="Signal">Signal & Telecom (SMMS / S&T)</option>
                      <option value="Electrical">Electrical (TDMS / TRD 25kV OHE)</option>
                      <option value="Operating">Operating / Traffic Department</option>
                    </select>
                  </div>
                </div>

                {/* Multi-Horizon Planning (PS Requirement #4: Daily / Weekly / Monthly) */}
                <div className="irctc-search-field">
                  <div className="irctc-field-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                  </div>
                  <div className="irctc-field-content">
                    <label className="irctc-field-label">Planning Horizon</label>
                    <select
                      value={horizon}
                      onChange={(e) => setHorizon(e.target.value)}
                      className="irctc-field-select"
                    >
                      <option value="24h">24-Hour Tactical (Emergency / Daily)</option>
                      <option value="7d">7-Day Rolling Plan (Weekly)</option>
                      <option value="30d">30-Day Strategic Plan (Monthly)</option>
                    </select>
                  </div>
                </div>

                {/* Search / Optimize Button */}
                <button 
                  type="submit" 
                  className="irctc-search-btn" 
                  id="search-trains-btn"
                  disabled={!isLoggedIn}
                  style={!isLoggedIn ? { opacity: 0.55, cursor: 'not-allowed', filter: 'grayscale(0.4)' } : {}}
                  title={!isLoggedIn ? "Officer Login Required to Run Optimizer" : "Optimize Corridor"}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8"></circle>
                    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                  </svg>
                  Optimize
                </button>
              </div>

              {!isLoggedIn && (
                <div style={{ marginTop: '14px', background: '#fef3c7', border: '1px solid #fde68a', color: '#92400e', padding: '8px 14px', borderRadius: '8px', fontSize: '0.8rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>🔒</span> <strong>Preview Mode:</strong> All solver controls and telemetry linkages are locked. Please login to access operational tools.
                </div>
              )}

              {searchFeedback && (
                <div className="irctc-search-feedback">
                  <span className="irctc-spinner"></span>
                  {searchFeedback}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="irctc-search-divider"></div>

            {/* Right Quick Action Cards (Image 1 Theme with Real Railway Actions) */}
            <div className="irctc-search-actions">
              <button
                type="button"
                className="irctc-action-card"
                onClick={handleLiveOccupancy}
                disabled={!isLoggedIn}
                style={!isLoggedIn ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={!isLoggedIn ? "Officer Login Required" : "Track Occupancy"}
              >
                <div className="irctc-action-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2"></rect>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                    <line x1="7" y1="15" x2="7.01" y2="15" strokeWidth="3"></line>
                    <line x1="11" y1="15" x2="13" y2="15"></line>
                  </svg>
                </div>
                <div className="irctc-action-card__title">Track Occupancy (COA)</div>
              </button>

              <button
                type="button"
                className="irctc-action-card"
                onClick={handleFieldTerminal}
                disabled={!isLoggedIn}
                style={!isLoggedIn ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={!isLoggedIn ? "Officer Login Required" : "Field 2G SMS"}
              >
                <div className="irctc-action-card__icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div className="irctc-action-card__title">Field 2G SMS (USP #1)</div>
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
