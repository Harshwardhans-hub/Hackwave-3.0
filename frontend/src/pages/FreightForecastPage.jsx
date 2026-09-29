import React, { useState } from 'react';
import './FreightForecastPage.css';

export default function FreightForecastPage({ onNavigate }) {
  const [selectedCorridor, setSelectedCorridor] = useState('NDLS-MTJ');
  const [activeRake, setActiveRake] = useState(null);

  const freightRakes = [
    {
      id: 'RAKE-BOXN-4892',
      type: 'BOXN (58 Wagons)',
      commodity: 'Thermal Coal (Power House)',
      origin: 'Korba SECL Coalfields',
      destination: 'Dadri NTPC Power Station',
      loco: 'WAG-9 Twin (Electric 12,000 HP)',
      weight: '4,850 Gross Tonnes',
      status: 'In Transit • On Schedule',
      corridorSlot: 'Passing Palwal at 01:15 AM',
      priority: 'Tier 1 (Power Plant Coal Stock: 3.2 Days)',
      conflictRisk: 'Zero (Path cleared ahead of 12049 Gatimaan)'
    },
    {
      id: 'RAKE-BCNA-1102',
      type: 'BCNA (42 Wagons)',
      commodity: 'Foodgrains (Wheat / Rice)',
      origin: 'Ludhiana Mandi (Punjab)',
      destination: 'Varanasi FCI Buffer Godown',
      loco: 'WAG-7 (Electric 5,000 HP)',
      weight: '3,200 Gross Tonnes',
      status: 'Held at Tuglakabad Loop',
      corridorSlot: 'Rescheduled to 04:45 AM',
      priority: 'Tier 2 (Food Security Priority)',
      conflictRisk: 'Adjusted by CP-SAT around Tamping Block'
    },
    {
      id: 'RAKE-BTPN-7841',
      type: 'BTPN (50 Tank Wagons)',
      commodity: 'Petroleum Products (Diesel/MS)',
      origin: 'IOCL Mathura Refinery',
      destination: 'Shakurbasti Oil Depot (Delhi)',
      loco: 'WAG-9 (Electric 6,000 HP)',
      weight: '3,900 Gross Tonnes',
      status: 'Loading Complete',
      corridorSlot: 'Departure 07:15 AM',
      priority: 'Tier 1 (Hazardous Inflammable Protocol)',
      conflictRisk: 'Zero (Post-maintenance green window)'
    },
    {
      id: 'RAKE-CONCOR-9032',
      type: 'BLCA/B (90 TEU Double Stack)',
      commodity: 'Export-Import Container Cargo',
      origin: 'ICD Tughlakabad',
      destination: 'Pipavav Port (Gujarat)',
      loco: 'WAG-9D (High Axle Load)',
      weight: '3,600 Gross Tonnes',
      status: 'Transit Corridor Reserved',
      corridorSlot: 'Departure 16:30 PM',
      priority: 'Tier 2 (Port Vessel Cutoff Compliance)',
      conflictRisk: 'Aligned with Western DFC Feeder Line'
    }
  ];

  const calmWindows = [
    {
      section: 'Palwal – Kosi Kalan (KM 60 – 100)',
      time: '01:30 AM – 04:45 AM (3h 15m)',
      confidence: '98% Calm Window',
      reason: 'No scheduled thermal coal rakes or express passenger trains.',
      recommendation: 'Optimal for BCM Deep Ballast Screening or CSM Tamping'
    },
    {
      section: 'Faridabad – Ballabgarh Loop (KM 28 – 38)',
      time: '12:00 PM – 02:15 PM (2h 15m)',
      confidence: '92% Calm Window',
      reason: 'Post-morning suburban peak gap prior to CONCOR freight dispatch.',
      recommendation: 'Ideal for S&T Point Machine Overhaul & Track Circuit Check'
    },
    {
      section: 'Mathura Junction Yard – Siding 2',
      time: '21:00 PM – 23:30 PM (2h 30m)',
      confidence: '95% Calm Window',
      reason: 'Yard shunting transition window between incoming rakes.',
      recommendation: 'Suitable for OHE 25kV Insulator Cleaning & Dropper Tuning'
    }
  ];

  return (
    <div className="freight-page">
      <header className="freight-header">
        <div className="freight-header__left">
          <div className="freight-header__badge">
            <span className="freight-header__dot"></span>
            KEY DIFFERENTIATOR • USP #2 (DATA.GOV.IN ENSEMBLE FORECASTER)
          </div>
          <h1 className="freight-header__title">
            Goods Train / Freight <span>Dynamic Forecaster</span>
          </h1>
          <p className="freight-header__subtitle">
            While passenger trains have fixed timetables, freight movements are dynamic. Sahayak Rail leverages historical data.gov.in monthly loadings + real-time COA section occupancy to predict goods train volume and expose conflict-free maintenance windows.
          </p>
        </div>

        <div className="freight-header__actions">
          <button className="freight-btn-secondary" onClick={() => onNavigate('dashboard')}>
            ← Return to Dashboard
          </button>
          <button className="freight-btn-primary" onClick={() => onNavigate('optimizer')}>
            Feed into CP-SAT Solver →
          </button>
        </div>
      </header>

      {/* Metrics Row */}
      <section className="freight-metrics-grid">
        <div className="freight-card">
          <span className="freight-card__label">Daily Freight In Transit</span>
          <span className="freight-card__val text-cyan">4.12 MT</span>
          <span className="freight-card__sub">Across Delhi Division Corridors</span>
        </div>

        <div className="freight-card">
          <span className="freight-card__label">Active Goods Rakes Tracked</span>
          <span className="freight-card__val text-mint">18 Rakes</span>
          <span className="freight-card__sub">BOXN, BCNA, BTPN, CONCOR</span>
        </div>

        <div className="freight-card">
          <span className="freight-card__label">Freight Transit Speed</span>
          <span className="freight-card__val text-lilac">34.8 km/h</span>
          <span className="freight-card__sub">+18% improvement via smart slotting</span>
        </div>

        <div className="freight-card">
          <span className="freight-card__label">Identified "Calm Windows"</span>
          <span className="freight-card__val text-white">3 High-Confidence</span>
          <span className="freight-card__sub">Zero freight conflict probability</span>
        </div>
      </section>

      {/* Main SVG Time-Series Chart Section */}
      <section className="freight-chart-section">
        <div className="freight-chart-header">
          <div>
            <h3>Corridor Freight Traffic Density vs Maintenance Slots (24-Hour Horizon)</h3>
            <p>Solid Azure: Actual Track Occupancy (COA) | Dashed Lilac: Prophet Seasonal Forecast (data.gov.in) | Mint Zones: Recommended Calm Windows</p>
          </div>
          <div className="freight-chart-controls">
            <select
              className="freight-select"
              value={selectedCorridor}
              onChange={(e) => setSelectedCorridor(e.target.value)}
            >
              <option value="NDLS-MTJ">Delhi – Mathura High Density Freight Trunk</option>
              <option value="GZB-MB">Ghaziabad – Moradabad Feeder Section</option>
              <option value="DLI-RE">Delhi – Rewari Container Corridor</option>
            </select>
          </div>
        </div>

        {/* SVG Time Series Graph */}
        <div className="freight-chart-wrapper">
          <svg className="freight-svg" viewBox="0 0 1000 320" preserveAspectRatio="none">
            <defs>
              <linearGradient id="calmZoneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#88D7D6" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#88D7D6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="peakZoneGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7D58A3" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#7D58A3" stopOpacity="0.04" />
              </linearGradient>
            </defs>

            {/* Calm Window Background Rectangles */}
            {/* Window 1: 01:00 to 04:30 (approx 41 to 187 px) */}
            <rect x="50" y="20" width="150" height="260" fill="url(#calmZoneGrad)" stroke="#88D7D6" strokeDasharray="3 3" strokeWidth="1.2" />
            <text x="125" y="45" fill="#A7E5E3" fontSize="11" fontWeight="700" textAnchor="middle">CALM WINDOW (01:00 - 04:30)</text>

            {/* Window 2: 12:00 to 14:15 (approx 500 to 593 px) */}
            <rect x="500" y="20" width="95" height="260" fill="url(#calmZoneGrad)" stroke="#88D7D6" strokeDasharray="3 3" strokeWidth="1.2" />
            <text x="547" y="45" fill="#A7E5E3" fontSize="11" fontWeight="700" textAnchor="middle">CALM (12-14h)</text>

            {/* Grid Lines */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={i} x1="50" y1={40 + i * 30} x2="960" y2={40 + i * 30} stroke="rgba(136,215,214,0.08)" />
            ))}

            {/* Actual Traffic Line (Electric Azure #38A3D8) */}
            <path
              d="M 50 240 Q 120 250 180 230 T 320 90 T 450 140 T 540 220 T 670 80 T 800 110 T 960 190"
              fill="none"
              stroke="#38A3D8"
              strokeWidth="3.2"
            />

            {/* Forecast Line (Soft Lilac #E4BBD3 Dashed) */}
            <path
              d="M 50 230 Q 120 240 180 220 T 320 95 T 450 150 T 540 210 T 670 70 T 800 120 T 960 180"
              fill="none"
              stroke="#E4BBD3"
              strokeWidth="2.5"
              strokeDasharray="6 4"
            />

            {/* Data Point Dots */}
            <circle cx="125" cy="235" r="4.5" fill="#38A3D8" />
            <circle cx="320" cy="90" r="4.5" fill="#E4BBD3" />
            <circle cx="540" cy="220" r="4.5" fill="#38A3D8" />
            <circle cx="670" cy="80" r="4.5" fill="#E4BBD3" />

            {/* X-Axis Hour Labels */}
            {['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00', '24:00'].map((time, i) => (
              <text key={time} x={50 + i * 113.75} y="300" fill="#8C9BBF" fontSize="11" textAnchor="middle" fontFamily="monospace">
                {time}
              </text>
            ))}
          </svg>

          <div className="freight-chart-legend">
            <span className="legend-item"><span className="legend-line azure"></span> Actual COA Goods Traffic</span>
            <span className="legend-item"><span className="legend-line lilac-dashed"></span> Prophet Forecast (data.gov.in)</span>
            <span className="legend-item"><span className="legend-zone mint"></span> Prime Maintenance Opportunity (Calm Window)</span>
          </div>
        </div>
      </section>

      {/* Two Column: Calm Windows & Active Rake Tracking */}
      <div className="freight-two-col">
        {/* Identified Calm Maintenance Windows */}
        <section className="freight-calm-section">
          <div className="section-head">
            <h3>Dynamic Free Maintenance Slots (No Freight Clash)</h3>
            <p>Automatically calculated windows with zero freight detention penalty</p>
          </div>

          <div className="calm-cards-list">
            {calmWindows.map((cw, idx) => (
              <div key={idx} className="calm-card">
                <div className="calm-card__top">
                  <span className="confidence-pill text-emerald">● {cw.confidence}</span>
                  <span className="time-badge">{cw.time}</span>
                </div>
                <h4 className="calm-card__section">{cw.section}</h4>
                <p className="calm-card__reason">{cw.reason}</p>
                <div className="calm-card__rec">
                  <strong>Recommended Use:</strong> {cw.recommendation}
                </div>
                <button className="calm-card__btn" onClick={() => onNavigate('optimizer')}>
                  Schedule Block Here in CP-SAT →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Live Freight Rake Tracker */}
        <section className="freight-rakes-section">
          <div className="section-head">
            <h3>Active Goods Rakes in Corridor</h3>
            <p>Tracked via FOIS / COA real-time telemetry</p>
          </div>

          <div className="rakes-list">
            {freightRakes.map((rake) => (
              <div 
                key={rake.id} 
                className={`rake-card ${activeRake?.id === rake.id ? 'active' : ''}`}
                onClick={() => setActiveRake(rake)}
              >
                <div className="rake-card__header">
                  <div>
                    <span className="rake-id font-mono text-cyan">{rake.id}</span>
                    <div className="rake-commodity">{rake.commodity}</div>
                  </div>
                  <span className="rake-type-badge">{rake.type}</span>
                </div>

                <div className="rake-card__route">
                  <span>{rake.origin}</span>
                  <span className="arrow">➔</span>
                  <span>{rake.destination}</span>
                </div>

                <div className="rake-card__slot">
                  <span className="label">Corridor Path:</span> {rake.corridorSlot}
                </div>

                <div className="rake-card__conflict">
                  <span className="label">Clash Status:</span> <span className="text-emerald">{rake.conflictRisk}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* data.gov.in Verification Stamp */}
      <footer className="freight-footer-badge">
        <div className="badge-icon">🏛️</div>
        <div>
          <strong>Grounded in Official Indian Railways Data Sources:</strong>
          <p>
            Sahayak Rail synthesizes monthly commodity-wise freight loading matrices published on <code>data.gov.in</code> (Ministry of Railways) with live section occupancy feeds from CRIS <strong>COA</strong> and <strong>FOIS</strong>.
          </p>
        </div>
      </footer>
    </div>
  );
}
