import React from 'react';
import promoImg from '../assets/irctc_railconnect_promo.jpg';
import { IndianRailwaysLogo } from './Logos';
import './RailConnectBanner.css';

export default function RailConnectBanner({ onNavigate, isLoggedIn = false }) {
  return (
    <section className="irctc-app-promo" id="field-gateway">
      <div className="irctc-app-promo__inner container">
        <div className="irctc-app-promo__card">
          {/* Left Graphic: Station & Vande Bharat with Indian Family (Image 4) */}
          <div className="irctc-app-promo__visual">
            <img 
              src={promoImg} 
              alt="Indian Railways Field Operations" 
              className="irctc-app-promo__img" 
            />
            <div className="irctc-app-promo__badge">
              <IndianRailwaysLogo size={36} />
              <div className="irctc-app-promo__badge-text">
                <strong>SAHAYAK RAIL</strong>
                <span>USP #1 • 2G SMS GATEWAY</span>
              </div>
            </div>
          </div>

          {/* Right Content: Field Dispatch Focus */}
          <div className="irctc-app-promo__content">
            <div className="irctc-app-promo__tag">KEY DIFFERENTIATOR • USP #1</div>
            <h2 className="irctc-app-promo__title">
              field dispatch, now just an SMS away
            </h2>
            <p className="irctc-app-promo__desc">
              Most railway track sections pass through remote areas with zero 4G/5G mobile internet. <strong>Sahayak Rail</strong> equips track gangmen, PWIs, and JEs with 2-way SMS/IVR fallback protocols and instant cryptographic <strong>Form T/348M (PTW)</strong> generation.
            </p>

            {/* Feature Highlights */}
            <div className="irctc-app-promo__features">
              <div className="irctc-app-feature">
                <div className="irctc-app-feature__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div>
                  <div className="irctc-app-feature__label">2G SMS Fallback</div>
                  <div className="irctc-app-feature__sub">Works with zero 4G data (₹0.15/SMS)</div>
                </div>
              </div>

              <div className="irctc-app-feature">
                <div className="irctc-app-feature__icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#005494" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                  </svg>
                </div>
                <div>
                  <div className="irctc-app-feature__label">Form T/348M PTW</div>
                  <div className="irctc-app-feature__sub">Cryptographic Private Number (PN)</div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="irctc-app-promo__actions">
              <button 
                type="button"
                className="irctc-app-btn-primary"
                disabled={!isLoggedIn}
                style={!isLoggedIn ? { opacity: 0.5, cursor: 'not-allowed', filter: 'grayscale(0.4)' } : {}}
                title={!isLoggedIn ? "Officer Login Required" : "Launch Field 2G SMS Terminal"}
                onClick={() => {
                  if (isLoggedIn && onNavigate) onNavigate('field-dispatch');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Launch Field 2G SMS Terminal
              </button>

              <button 
                type="button"
                className="irctc-app-btn-secondary"
                disabled={!isLoggedIn}
                style={!isLoggedIn ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                title={!isLoggedIn ? "Officer Login Required" : "View Form T/348M Spec"}
                onClick={() => {
                  if (isLoggedIn && onNavigate) onNavigate('field-dispatch');
                }}
              >
                View Form T/348M Spec
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
