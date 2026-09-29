import React, { useState } from 'react';
import './WeatherPage.css';

export default function WeatherPage({ onNavigate }) {
  const [monsoonAlertActive, setMonsoonAlertActive] = useState(false);

  const vulnerableSections = [
    {
      id: 'SEC-W1',
      name: 'Yamuna River Bridge No. 142 (KM 142.20)',
      corridor: 'NDLS – AGC Mainline',
      hazard: 'River Flood Level Ingress',
      telemetry: 'Water Level: 204.85m (Warning: 205.33m)',
      action: 'Night ballast cleaning suspended; visual pier scour watch initiated.',
      status: 'YELLOW PRECAUTION',
      rescheduled: true
    },
    {
      id: 'SEC-W2',
      name: 'Vindhya Ghat Cutting (KM 312 – 318)',
      corridor: 'JHS – GWL Grand Trunk',
      hazard: 'Landslide & Boulder Fall Threat',
      telemetry: 'Soil Moisture Saturation: 88% (High)',
      action: 'Heavy mechanical track tamping postponed. Rockfall sensor patrol deployed.',
      status: 'ORANGE ALERT',
      rescheduled: true
    },
    {
      id: 'SEC-W3',
      name: 'Kanpur Ganga Bridge Approach (KM 74.00)',
      corridor: 'CNB – LKO Corridor',
      hazard: 'Track Circuit Waterlogging',
      telemetry: 'Precipitation: 42 mm/hr Intense Rain',
      action: 'Prioritized S&T epoxy cable jointing & drainage clearing block.',
      status: 'ACTIVE MITIGATION',
      rescheduled: false
    },
    {
      id: 'SEC-W4',
      name: 'Mathura High-Speed Tangent (KM 110 – 130)',
      corridor: 'NDLS – MTJ High Speed',
      hazard: 'Summer Rail Buckling / Thermal Stress',
      telemetry: 'Rail Temperature: 48.5°C (Threshold: 55°C)',
      action: 'De-stressing parameter logged. TSR 120 km/h during peak afternoon heat.',
      status: 'THERMAL WATCH',
      rescheduled: false
    }
  ];

  return (
    <div className="weather-page">
      <header className="weather-header">
        <div className="weather-header__left">
          <div className="weather-header__badge">
            <span className="weather-header__dot"></span>
            KEY DIFFERENTIATOR • USP #3 (IMD WEATHER & MONSOON RESILIENCE)
          </div>
          <h1 className="weather-header__title">
            Weather & Monsoon <span>Risk Adaptation Radar</span>
          </h1>
          <p className="weather-header__subtitle">
            Monsoon floods, track washouts, and extreme rail expansion regularly paralyze Indian Railways. Sahayak Rail integrates India Meteorological Department (IMD) live feeds to automatically reschedule vulnerable outdoor blocks to safe, dry corridors.
          </p>
        </div>

        <div className="weather-header__actions">
          <button className="weather-btn-secondary" onClick={() => onNavigate('dashboard')}>
            ← Return to Dashboard
          </button>
          <button
            className={`weather-btn-alert ${monsoonAlertActive ? 'active' : ''}`}
            onClick={() => setMonsoonAlertActive(!monsoonAlertActive)}
          >
            {monsoonAlertActive ? '✓ Clear IMD Red Alert' : '⚡ Simulate IMD Cloudburst Alert'}
          </button>
        </div>
      </header>

      {/* Live Weather Telemetry Strip */}
      <section className="weather-telemetry-grid">
        <div className="weather-card">
          <span className="weather-card__label">IMD Regional Advisory</span>
          <span className="weather-card__val text-amber">Orange Advisory</span>
          <span className="weather-card__sub">Heavy Monsoon Ingress across Delhi/NCR</span>
        </div>

        <div className="weather-card">
          <span className="weather-card__label">Bridges Under Radar</span>
          <span className="weather-card__val text-cyan">4 River Crossings</span>
          <span className="weather-card__sub">Continuous ultrasonic water gauge feed</span>
        </div>

        <div className="weather-card">
          <span className="weather-card__label">Max Rail Temperature</span>
          <span className="weather-card__val text-emerald">48.5°C</span>
          <span className="weather-card__sub">Below 55°C emergency de-stress limit</span>
        </div>

        <div className="weather-card">
          <span className="weather-card__label">Auto-Rescheduled Blocks</span>
          <span className="weather-card__val text-white">{monsoonAlertActive ? '4 Blocks' : '2 Blocks'}</span>
          <span className="weather-card__sub">Diverted to indoor yard works</span>
        </div>
      </section>

      {/* Contingency Simulation Showcase */}
      {monsoonAlertActive && (
        <section className="weather-contingency-box">
          <div className="contingency-header">
            <span className="contingency-badge">IMD RED WARNING TRIGGERED</span>
            <h3>Automated Monsoon Rescheduling Plan Enacted</h3>
          </div>
          <p className="contingency-desc">
            Extreme downpour predicted for Palwal–Kosi Kalan section (110 mm expected in 3 hours). The CP-SAT solver has dynamically adjusted today's schedule:
          </p>

          <div className="contingency-steps">
            <div className="step-card postponed">
              <div className="step-tag text-amber">POSTPONED</div>
              <h4>CSM Track Tamping at KM 127</h4>
              <p>Postponed by 48 hours to prevent track bed destabilization on wet ballast.</p>
            </div>

            <div className="step-card substituted">
              <div className="step-tag text-emerald">SUBSTITUTED (SAFE ALTERNATIVE)</div>
              <h4>Mathura Station Covered Yard S&T Overhaul</h4>
              <p>Gang relocated to covered yard interlocking. Zero downtime wasted!</p>
            </div>

            <div className="step-card safety">
              <div className="step-tag text-cyan">WATER PATROL ACTIVATED</div>
              <h4>Yamuna Bridge Water Watch Gang</h4>
              <p>Foot patrol gang equipped with GPS tracker and detonator signals deployed.</p>
            </div>
          </div>
        </section>
      )}

      {/* Vulnerable Section Radar Table */}
      <section className="weather-table-section">
        <div className="weather-table-header">
          <div>
            <h3>Monsoon & Vulnerable Section Watchlist</h3>
            <p>Live sensor telemetry linked with C&W (Carriage & Wagon) / Civil Engineering divisions</p>
          </div>
        </div>

        <div className="weather-table-wrapper">
          <table className="weather-table">
            <thead>
              <tr>
                <th>Section Code</th>
                <th>Vulnerable Location</th>
                <th>Corridor</th>
                <th>Hazard Type</th>
                <th>Live Sensor Diagnostics</th>
                <th>Adaptive Protocol</th>
                <th>Risk State</th>
              </tr>
            </thead>
            <tbody>
              {vulnerableSections.map((sec) => (
                <tr key={sec.id}>
                  <td className="font-mono text-cyan">{sec.id}</td>
                  <td><strong>{sec.name}</strong></td>
                  <td>{sec.corridor}</td>
                  <td><span className="hazard-tag">{sec.hazard}</span></td>
                  <td className="font-mono text-emerald">{sec.telemetry}</td>
                  <td className="action-cell">{sec.action}</td>
                  <td>
                    <span className={`status-pill ${sec.status.includes('ORANGE') ? 'orange' : sec.status.includes('YELLOW') ? 'yellow' : 'green'}`}>
                      {sec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Bottom IMD Integration Notes */}
      <footer className="weather-footer">
        <div className="weather-footer__icon">🌦️</div>
        <div>
          <strong>Operational Climate Resilience:</strong>
          <p>
            Sahayak Rail bridges civil engineering safety limits (IRPWM Track Manual Paras 601–620) with live IMD regional radar, protecting Indian Railways from derailments caused by flash track washouts or extreme sun-kink rail expansion.
          </p>
        </div>
      </footer>
    </div>
  );
}
