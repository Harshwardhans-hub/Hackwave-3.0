import React, { useState, useEffect, useRef } from 'react';
import { IndianRailwaysLogo, IRCTCLogo } from './Logos';
import './Navbar.css';

export default function Navbar({ currentRoute, onNavigate, onOpenLogin, currentUser, onLogout }) {
  const [istTime, setIstTime] = useState('');
  const [systemsDropdownOpen, setSystemsDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownWrapperRef = useRef(null);
  const dropdownTimeoutRef = useRef(null);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setSystemsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setSystemsDropdownOpen(false);
    }, 250);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownWrapperRef.current && !dropdownWrapperRef.current.contains(e.target)) {
        setSystemsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = '2026';
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      setIstTime(`${hours}:${minutes}:${seconds} IST`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Role-aware nav items — what shows in the pill bar depends on who is logged in
  const getDashboardRoute = () => {
    if (!currentUser) return 'dashboard';
    return currentUser.authType === 'COA' ? 'coa-dashboard' : 'dept-dashboard';
  };

  const isDashboardActive = () => {
    return ['coa-dashboard', 'dept-dashboard'].includes(currentRoute);
  };

  const coaNavItems = [
    { id: 'coa-dashboard', label: 'DASHBOARD' },
    { id: 'coa-requests',  label: 'REQUESTS'  },
    { id: 'coa-schedule',  label: 'SCHEDULE'  },
    { id: 'weather',       label: 'WEATHER'   },
    { id: 'freight',       label: 'FREIGHT'   },
    { id: 'field-dispatch',label: 'DISPATCH'  },
    { id: 'audit',         label: 'AUDIT'     },
  ];

  const deptNavItems = [
    { id: 'dept-dashboard', label: 'DASHBOARD' },
    { id: 'dept-requests',  label: 'REQUESTS'  },
    { id: 'dept-schedule',  label: 'SCHEDULE'  },
    { id: 'dept-contact',   label: 'INTER-DEPT'},
    { id: 'dept-dispatch',  label: 'DISPATCH'  },
  ];

  const activeNavItems = currentUser?.authType === 'COA' ? coaNavItems : deptNavItems;

  // Authentic Indian Railways data systems & modules
  const systemMenuItems = [
    { label: 'TMS (Track Defects, TGI & USFD)', icon: '🛤️', action: () => onNavigate(getDashboardRoute()) },
    { label: 'SMMS (Signals & Point Machines)', icon: '🚦', action: () => onNavigate(getDashboardRoute()) },
    { label: 'TDMS (25kV OHE Catenary & TRD)', icon: '⚡', action: () => onNavigate(getDashboardRoute()) },
    { label: 'COA (Train Timetables & Occupancy)', icon: '🕒', action: () => onNavigate(getDashboardRoute()) },
    { label: 'Freight Forecaster (data.gov.in)', icon: '📦', badge: 'USP #2', action: () => onNavigate('freight') },
    { label: 'Field 2G SMS / WhatsApp Dispatch', icon: '📱', badge: 'USP #1', action: () => onNavigate(currentUser?.authType === 'COA' ? 'field-dispatch' : 'dept-dispatch') },
    { label: 'IMD Weather & Monsoon Radar', icon: '🌧️', badge: 'USP #3', action: () => onNavigate('weather') },
    { label: 'Cross-Dept Bidding & Bundling', icon: '⚖️', badge: 'USP #4', action: () => onNavigate(currentUser?.authType === 'COA' ? 'coa-requests' : 'dept-requests') },
    { label: 'CRIS Form T/348M (PTW Dispatch)', icon: '📋', action: () => onNavigate(currentUser?.authType === 'COA' ? 'field-dispatch' : 'dept-dispatch') },
    { label: 'XAI & Safety Rules Audit (IRPWM)', icon: '🔍', action: () => onNavigate('audit') }
  ];

  return (
    <header className="irctc-header" id="main-nav">
      {/* MAIN IRCTC BLUE NAV BAR */}
      <div className="irctc-nav-bar">
        <div className="irctc-nav-inner container">
          {/* Left Brand with official logos */}
          <div className="irctc-nav-left">
            <div 
              className="irctc-brand-identity"
              onClick={() => onNavigate(currentUser ? 'overview' : 'landing')}
              role="button"
              tabIndex={0}
            >
              <div className="irctc-brand-emblems">
                <IndianRailwaysLogo size={36} className="irctc-emblem-ir" />
                <IRCTCLogo size={34} className="irctc-emblem-irctc" />
              </div>
              <div className="irctc-brand-text">
                <div className="irctc-brand-title">Sahayak <span>Rail</span></div>
                <div className="irctc-brand-sub">INDIAN RAILWAYS • HACKWAVE 3.0</div>
              </div>
            </div>
          </div>

          {/* Center Capsule Navigation Menu */}
          <nav className={`irctc-nav-capsule ${mobileOpen ? 'open' : ''}`}>
            {currentUser ? (
              <>
                {/* RAILWAY SYSTEMS DROPDOWN */}
                <div 
                  className="irctc-nav-dropdown-wrapper"
                  ref={dropdownWrapperRef}
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    className={`irctc-nav-pill irctc-dropdown-trigger ${systemsDropdownOpen ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSystemsDropdownOpen((prev) => !prev);
                    }}
                    aria-expanded={systemsDropdownOpen}
                  >
                    SYSTEMS
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {systemsDropdownOpen && (
                    <div 
                      className="irctc-trains-dropdown"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                    >
                      <div className="irctc-trains-dropdown-list">
                        {systemMenuItems.map((item, idx) => (
                          <button
                            type="button"
                            key={idx}
                            className="irctc-trains-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              item.action();
                              setSystemsDropdownOpen(false);
                              setMobileOpen(false);
                            }}
                          >
                            <span className="irctc-trains-item-icon">{item.icon}</span>
                            <span className="irctc-trains-item-label">{item.label}</span>
                            {item.badge && <span className="irctc-item-badge">{item.badge}</span>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role-aware nav pills */}
                {activeNavItems.map((item) => (
                  <button
                    key={item.id}
                    className={`irctc-nav-pill ${currentRoute === item.id ? 'active' : ''}`}
                    onClick={() => {
                      onNavigate(item.id);
                      setMobileOpen(false);
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </>
            ) : (
              <div style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', fontWeight: 600, padding: '4px 12px', letterSpacing: '0.04em' }}>
                🔒 OFFICIAL SYSTEM DEMO • LOGIN FOR OPERATIONAL CONTROLLER ACCESS
              </div>
            )}
          </nav>

          {/* Right Action Controls */}
          <div className="irctc-nav-right">
            <span className="irctc-nav-clock">{istTime}</span>

            {currentUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="irctc-user-badge">
                  <span>👨‍✈️</span>
                  <span className="irctc-user-badge__name">{currentUser.name?.split(' ')[0] || 'Officer'}</span>
                  <span style={{ fontSize: '0.7rem', opacity: 0.85 }}>({currentUser.role?.split(' ')[0] || 'CRIS'})</span>
                </div>
                <button
                  className="irctc-logout-btn"
                  onClick={onLogout}
                  id="header-logout-btn"
                >
                  LOGOUT
                </button>
              </div>
            ) : (
              <button
                className="irctc-login-btn"
                onClick={() => onNavigate('login')}
                id="header-login-btn"
              >
                OFFICER LOGIN
              </button>
            )}

            <button
              className="irctc-mobile-menu-btn"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                {mobileOpen ? (
                  <>
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </>
                ) : (
                  <>
                    <line x1="3" y1="12" x2="21" y2="12"></line>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <line x1="3" y1="18" x2="21" y2="18"></line>
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
