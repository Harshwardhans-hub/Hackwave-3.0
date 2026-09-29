import React, { useState } from 'react';
import { IndianRailwaysLogo, CRISLogo } from '../components/Logos';
import './LoginPage.css';

const DEPARTMENT_PROFILES = [
  {
    key: 'COA',
    label: 'COA – Control Office Application',
    subtitle: 'Section Controller / Orchestrating Body',
    icon: '🎛️',
    color: '#3B82F6',
    role: 'Section Controller',
    department: 'COA (Control Office Application)',
    division: 'Northern Railway / Delhi Division (DLI)',
    name: 'Chief Controller A. K. Verma',
    authType: 'COA',
    redirectTo: 'coa-dashboard',
  },
  {
    key: 'PWAY',
    label: 'P-Way – Permanent Way / Engineering',
    subtitle: 'Track Maintenance & Civil Engineering',
    icon: '🛤️',
    color: '#10B981',
    role: 'Senior Section Engineer (SSE)',
    department: 'Engineering (P-Way)',
    division: 'Palwal – Mathura Section',
    name: 'SSE R. K. Sharma',
    authType: 'PWAY',
    redirectTo: 'dept-dashboard',
  },
  {
    key: 'SNT',
    label: 'S&T – Signal & Telecommunication',
    subtitle: 'Signalling, Interlocking & Telecom',
    icon: '🚦',
    color: '#F59E0B',
    role: 'Senior Section Engineer (SSE)',
    department: 'Signal & Telecom (S&T)',
    division: 'Delhi – Agra Mainline',
    name: 'SSE M. Patel',
    authType: 'SNT',
    redirectTo: 'dept-dashboard',
  },
  {
    key: 'TRD',
    label: 'TRD – Traction Distribution (25kV OHE)',
    subtitle: 'Overhead Electrification & Traction Power',
    icon: '⚡',
    color: '#8B5CF6',
    role: 'Senior Section Engineer (SSE)',
    department: 'Electrical (TRD / OHE)',
    division: 'Okhla Traction Substation',
    name: 'SSE K. Deshmukh',
    authType: 'TRD',
    redirectTo: 'dept-dashboard',
  },
];

export default function LoginPage({ onLogin, onNavigate }) {
  const [selected, setSelected] = useState(null);
  const [officerName, setOfficerName] = useState('');
  const [division, setDivision] = useState('');
  const [step, setStep] = useState('select'); // 'select' | 'confirm'

  const handleSelectDept = (profile) => {
    setSelected(profile);
    setOfficerName(profile.name);
    setDivision(profile.division);
    setStep('confirm');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selected) return;
    onLogin({
      name: officerName || selected.name,
      department: selected.department,
      role: selected.role,
      division: division || selected.division,
      authType: selected.authType,
      redirectTo: selected.redirectTo,
    });
  };

  const handleBack = () => {
    setSelected(null);
    setStep('select');
  };

  return (
    <div className="login-page-container">
      <div className="login-card-wrapper">
        <div className="login-card">
          {/* Header */}
          <div className="login-card-header">
            <div className="login-header-logos">
              <IndianRailwaysLogo size={52} />
              <CRISLogo size={46} />
            </div>
            <h1 className="login-card-title">
              Sahayak <span>Rail</span> SSO Gateway
            </h1>
            <div className="login-card-subtitle">
              MINISTRY OF RAILWAYS • HACKWAVE 3.0 • CRIS E-OFFICE
            </div>
          </div>

          {/* Step 1: Department Selection */}
          {step === 'select' && (
            <div className="login-dept-select">
              <p className="login-dept-prompt">Select your department to continue:</p>
              <div className="login-dept-grid">
                {DEPARTMENT_PROFILES.map((profile) => (
                  <button
                    key={profile.key}
                    className="login-dept-card"
                    onClick={() => handleSelectDept(profile)}
                    style={{ '--dept-color': profile.color }}
                  >
                    <span className="login-dept-icon">{profile.icon}</span>
                    <div className="login-dept-info">
                      <span className="login-dept-label">{profile.label}</span>
                      <span className="login-dept-sub">{profile.subtitle}</span>
                    </div>
                    <svg className="login-dept-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Confirm Details & Login */}
          {step === 'confirm' && selected && (
            <form className="login-form-body" onSubmit={handleSubmit}>
              <button type="button" className="login-back-btn" onClick={handleBack}>
                ← Back
              </button>

              <div className="login-selected-dept" style={{ '--dept-color': selected.color }}>
                <span className="login-dept-icon">{selected.icon}</span>
                <div>
                  <span className="login-dept-label">{selected.label}</span>
                  <span className="login-dept-sub">{selected.subtitle}</span>
                </div>
              </div>

              <div className="login-field-group">
                <label className="login-label">Officer / Engineer Name</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">👤</span>
                  <input
                    type="text"
                    value={officerName}
                    onChange={(e) => setOfficerName(e.target.value)}
                    className="login-input"
                    placeholder="Full name"
                    required
                  />
                </div>
              </div>

              <div className="login-field-group">
                <label className="login-label">Division / Section</label>
                <div className="login-input-wrap">
                  <span className="login-input-icon">📍</span>
                  <input
                    type="text"
                    value={division}
                    onChange={(e) => setDivision(e.target.value)}
                    className="login-input"
                    placeholder="Division / Section"
                    required
                  />
                </div>
              </div>

              <button type="submit" className="login-btn-submit" id="btn-login-submit">
                Enter Operational Portal →
              </button>
            </form>
          )}

          {/* Footer */}
          <div className="login-footer-nav">
            <span
              className="login-back-link"
              onClick={() => onNavigate('landing')}
              role="button"
              tabIndex={0}
            >
              ← Return to Public Information Portal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
