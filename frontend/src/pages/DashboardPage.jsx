import React, { useState } from 'react';
import './DashboardPage.css';

export default function DashboardPage({ onNavigate }) {
  const [selectedHorizon, setSelectedHorizon] = useState('24h');
  const [selectedDept, setSelectedDept] = useState('all');
  const [activeSection, setActiveSection] = useState('NDLS-AGC');
  const [activeBlock, setActiveBlock] = useState(null);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [solveStatus, setSolveStatus] = useState({
    time: '1.18s',
    conflicts: 0,
    savedHours: '4.5 hrs',
    status: 'OPTIMAL (CP-SAT v9.8)'
  });

  // Authentic block data
  const corridors = [
    {
      id: 'UP_MAIN',
      name: 'UP Main Line',
      code: 'NDLS ➔ AGC (KM 00.00 – 198.50)',
      speed: '160 km/h (Group A)',
      blocks: [
        {
          id: 'BLK-101',
          name: 'Shadow Block #104: Tamping + Point M/C + OHE',
          start: 0.5,
          end: 3.75,
          type: 'bundle',
          dept: 'MULTI (P-Way + S&T + TRD)',
          km: 'KM 127.40 – 129.20',
          privateNo: 'PN-884102-DLI',
          tsr: '30 km/h Caution Order',
          details: 'Synchronized possession: CSM-92 tamping, Point 104 Overhaul, and 25kV catenary wash in a single window.',
          hoursSaved: '3.2 hrs saved vs separate closures'
        },
        {
          id: 'TRN-12049',
          name: '12049 Gatimaan Express',
          start: 6.1,
          end: 8.3,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'Through Transit (HZM-AGC)',
          tsr: 'Normal 160 km/h',
          details: 'Flagship priority express train. Non-stop corridor allocation with 15-min safety headway.'
        },
        {
          id: 'BLK-102',
          name: 'USFD Ultrasonic Rail Flaw Scan',
          start: 9.0,
          end: 11.5,
          type: 'pway',
          dept: 'P-WAY (ENGG)',
          km: 'KM 84.10 – 92.50',
          privateNo: 'PN-741982-AGC',
          tsr: 'Trolley on track (Block protection)',
          details: 'Mandatory rail ultrasonic flaw test as per IRPWM Para 808. Trolley protection with detonator signals.'
        },
        {
          id: 'TRN-22436',
          name: '22436 Vande Bharat Express',
          start: 11.8,
          end: 13.9,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'Through Transit (NDLS-BSB)',
          tsr: 'Normal 130 km/h',
          details: 'Semi-high speed EMU express. Punctuality monitor weight 1.0.'
        },
        {
          id: 'FRT-BOXN',
          name: 'BOXN 58W Coal Freight Rake',
          start: 14.5,
          end: 17.0,
          type: 'freight',
          dept: 'FREIGHT',
          km: 'Okhla – Mathura Goods',
          tsr: '75 km/h Loaded',
          details: 'Power house priority coal rake to Dadri Thermal Plant. Slot aligned via data.gov.in predictive goods schedule.'
        },
        {
          id: 'TRN-12302',
          name: '12302 Howrah Rajdhani',
          start: 17.5,
          end: 19.8,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'NDLS Outbound',
          tsr: 'Normal 130 km/h',
          details: 'Superfast Rajdhani Express with green wave signal precedence.'
        },
        {
          id: 'BLK-103',
          name: 'Deep Ballast Cleaning (BCM #14)',
          start: 20.5,
          end: 23.5,
          type: 'pway',
          dept: 'P-WAY (ENGG)',
          km: 'KM 145.00 – 148.00',
          privateNo: 'PN-912834-MTJ',
          tsr: '45 km/h for 48 hrs',
          details: 'Mechanized ballast cleaning machine block with automated tamping trail.'
        }
      ]
    },
    {
      id: 'DN_MAIN',
      name: 'DOWN Main Line',
      code: 'AGC ➔ NDLS (KM 198.50 – 00.00)',
      speed: '160 km/h (Group A)',
      blocks: [
        {
          id: 'BLK-201',
          name: 'Rail Renewal B-44 (120m Long Welded Rail)',
          start: 1.0,
          end: 4.2,
          type: 'pway',
          dept: 'P-WAY (ENGG)',
          km: 'KM 62.00 – 63.50',
          privateNo: 'PN-632019-DLI',
          tsr: '20 km/h Dead Stop & Proceed',
          details: 'Laying of 60kg 90UTS flash butt welded rails to eliminate rail joints.'
        },
        {
          id: 'FRT-BCNA',
          name: 'BCNA 42W Foodgrain Special',
          start: 5.0,
          end: 7.5,
          type: 'freight',
          dept: 'FREIGHT',
          km: 'Punjab Mandi to Agra',
          tsr: '75 km/h Normal',
          details: 'FCI subsidized grain special freight train.'
        },
        {
          id: 'TRN-12002',
          name: '12002 Bhopal Shatabdi Express',
          start: 8.0,
          end: 10.3,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'Inbound to New Delhi',
          tsr: 'Normal 150 km/h',
          details: 'High-speed executive corridor slot.'
        },
        {
          id: 'BLK-202',
          name: 'OHE 25kV Wire Stagger & Dropper Tuning',
          start: 11.0,
          end: 13.2,
          type: 'trd',
          dept: 'TRD (OHE)',
          km: 'KM 110.00 – 114.50',
          privateNo: 'PN-394821-PAL',
          tsr: 'OHE Isolated (De-energized 25kV)',
          details: 'ACTM Vol II Para 2063 compliance. Tower wagon possession with earth pole discharge.'
        },
        {
          id: 'TRN-12952',
          name: '12952 Mumbai Tejas Rajdhani',
          start: 14.0,
          end: 16.2,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'MTJ-NZM Section',
          tsr: 'Normal 130 km/h',
          details: 'Smart coach premium express service.'
        },
        {
          id: 'FRT-CONCOR',
          name: 'CONCOR Container Rake (90 TEU)',
          start: 16.8,
          end: 19.5,
          type: 'freight',
          dept: 'FREIGHT',
          km: 'Tughlakabad ICD to Pipavav',
          tsr: '100 km/h High Axle Load',
          details: 'Double stack container rake slot.'
        },
        {
          id: 'TRN-12280',
          name: '12280 Taj Express',
          start: 20.0,
          end: 22.5,
          type: 'passenger',
          dept: 'PASSENGER',
          km: 'VGLB to NDLS',
          tsr: 'Normal 110 km/h',
          details: 'Intercity daily express.'
        }
      ]
    },
    {
      id: 'GOODS_LOOP',
      name: 'Third / Goods Loop Line',
      code: 'Faridabad – Mathura Loop (KM 30 – 140)',
      speed: '75 km/h Loop',
      blocks: [
        {
          id: 'BLK-301',
          name: 'Track Circuit Glued Joint Renewal',
          start: 2.0,
          end: 5.5,
          type: 'snt',
          dept: 'S&T (SIGNALLING)',
          km: 'KM 52.10',
          privateNo: 'PN-558291-FDB',
          tsr: 'Disconnection Memo Served',
          details: 'Insulated joint overhaul to prevent track circuit false occupied alarms.'
        },
        {
          id: 'FRT-EMPTY',
          name: 'Empty BOXN Rake to Singrauli Coalfields',
          start: 6.5,
          end: 10.0,
          type: 'freight',
          dept: 'FREIGHT',
          km: 'Loop Staging Track',
          tsr: '60 km/h',
          details: 'Empty return movement bypassing passenger express paths.'
        },
        {
          id: 'BLK-302',
          name: 'Point Machine 112-B Rodding Overhaul',
          start: 11.5,
          end: 14.5,
          type: 'snt',
          dept: 'S&T (SIGNALLING)',
          km: 'Palwal Yard KM 60',
          privateNo: 'PN-104928-PWL',
          tsr: 'Caution 15 km/h over points',
          details: 'Routine S&T interlocking maintenance.'
        },
        {
          id: 'FRT-CEMENT',
          name: 'BCCN Bulk Cement Wagon Rake',
          start: 15.5,
          end: 18.5,
          type: 'freight',
          dept: 'FREIGHT',
          km: 'Wadi to Shakurbasti',
          tsr: '65 km/h',
          details: 'Covered bulk commodity transport.'
        },
        {
          id: 'BLK-303',
          name: 'Yard Siding Turnout Tamping',
          start: 19.5,
          end: 23.0,
          type: 'pway',
          dept: 'P-WAY (ENGG)',
          km: 'Mathura Jn Yard Siding 4',
          privateNo: 'PN-789012-MTJ',
          tsr: 'Yard speed 15 km/h',
          details: 'Unomatic tamping for turnout geometry correction.'
        }
      ]
    }
  ];

  const tacticalDays = [
    {
      day: 'Monday (10-Sep)',
      code: 'MON-DLI-01',
      section: 'NDLS – AGC (KM 142.0 – 146.0)',
      track: 'UP Main Line',
      type: 'bundle',
      dept: 'MULTI (P-Way + S&T + TRD)',
      title: 'Deep Ballast Cleaning (BCM #14) + Point 104 Overhaul + OHE 25kV Wash',
      window: '00:30 – 04:00 (3.5h)',
      saved: '3.2 hrs saved',
      status: 'APPROVED & LOCKED',
      tsr: '45 km/h Caution Order',
      pn: 'PN-884102-DLI'
    },
    {
      day: 'Tuesday (11-Sep)',
      code: 'TUE-DLI-02',
      section: 'NDLS – AGC (KM 88.0 – 95.0)',
      track: 'DOWN Main Line',
      type: 'pway',
      dept: 'P-WAY + USFD',
      title: 'CSM-92 High-Speed Tamping + Ultrasonic Rail Flaw Scan (Para 808)',
      window: '01:00 – 05:00 (4.0h)',
      saved: '2.8 hrs saved',
      status: 'CONFIRMED',
      tsr: '30 km/h Caution Order',
      pn: 'PN-741982-AGC'
    },
    {
      day: 'Wednesday (12-Sep)',
      code: 'WED-DLI-03',
      section: 'Palwal Yard (KM 60.0 – 62.0)',
      track: 'Goods Loop Track',
      type: 'snt',
      dept: 'S&T (INTERLOCKING)',
      title: 'Turnout Renewal Point 112-B + Track Circuit Glued Joint Renewal',
      window: '10:30 – 13:30 (3.0h)',
      saved: '1.9 hrs saved',
      status: 'SCHEDULED',
      tsr: '15 km/h over Turnouts',
      pn: 'PN-558291-FDB'
    },
    {
      day: 'Thursday (13-Sep)',
      code: 'THU-DLI-04',
      section: 'Mathura Jn (KM 110.0 – 114.5)',
      track: 'UP Main Line',
      type: 'trd',
      dept: 'TRD (OHE 25kV)',
      title: 'OHE Catenary Wire Dropper & Stagger Tuning (ACTM Vol II Para 2063)',
      window: '02:00 – 05:30 (3.5h)',
      saved: '2.5 hrs saved',
      status: 'SCHEDULED',
      tsr: '25kV Power Block De-energized',
      pn: 'PN-394821-PAL'
    },
    {
      day: 'Friday (14-Sep)',
      code: 'FRI-DLI-05',
      section: 'Faridabad – Palwal (KM 35.0 – 48.0)',
      track: '3rd & 4th Line',
      type: 'bundle',
      dept: 'MULTI (P-Way + S&T)',
      title: 'Continuous Rail Milling (RGM) + Axle Counter Calibration',
      window: '00:45 – 05:00 (4.25h)',
      saved: '3.6 hrs saved',
      status: 'COA INTEGRATED',
      tsr: '50 km/h Caution Order',
      pn: 'PN-912834-MTJ'
    },
    {
      day: 'Saturday (15-Sep)',
      code: 'SAT-DLI-06',
      section: 'Kosi Kalan – Chhata (KM 98.0 – 106.0)',
      track: 'DOWN Main Line',
      type: 'pway',
      dept: 'P-WAY (ENGG)',
      title: 'Long Welded Rail (LWR) Destressing & Flash Butt Weld Renewal',
      window: '01:15 – 04:45 (3.5h)',
      saved: '2.2 hrs saved',
      status: 'LOCKED',
      tsr: '20 km/h Dead Stop & Proceed',
      pn: 'PN-632019-DLI'
    },
    {
      day: 'Sunday (16-Sep)',
      code: 'SUN-DLI-07',
      section: 'Mathura Junction Yard',
      track: 'All Yard Lines & Loops',
      type: 'bundle',
      dept: 'MULTI-DEPARTMENT MEGA BLOCK',
      title: 'Comprehensive Yard Mega Possession: Unomatic Tamping + Signalling Interlock Cut-over',
      window: '00:00 – 05:00 (5.0h)',
      saved: '4.8 hrs saved',
      status: 'DIVISION SANCTIONED',
      tsr: 'Yard Block & Caution Orders',
      pn: 'PN-789012-MTJ'
    }
  ];

  const strategicWeeks = [
    {
      week: 'Week 1 (Sep 10 – 16)',
      title: 'Northern Division Track Renewal & Bridge Span Replacement',
      highlight: 'Bridge #18 Girder Replacement (KM 60 Palwal) • 6-Hour Single-Line Working (SLW)',
      impact: 'Corridor Capacity: 91.2% | Zero Freight Rakes Cancelled (Diverted via Goods Loop)',
      blocksCount: '28 Tactical Blocks',
      savings: '22.4 Track-Hours Saved',
      items: [
        'Palwal Bridge #18 Superstructure Girder Launching (P-Way Bridge Gang)',
        'BCM Ballast Cleaning Machine deployment KM 142–148 (High-Density Corridor)',
        'OHE 25kV Feeder Wire Modernization at Okhla Traction Substation'
      ]
    },
    {
      week: 'Week 2 (Sep 17 – 23)',
      title: 'Continuous Heavy Track Renewal (PQRS 18km Stretch)',
      highlight: 'Mechanized Track Relay System (PQRS) replacing aged 52kg with 60kg 90UTS Rails',
      impact: 'Corridor Capacity: 93.8% | Speed Potential Upgraded to 160 km/h Mission Raftaar',
      blocksCount: '34 Tactical Blocks',
      savings: '26.8 Track-Hours Saved',
      items: [
        'PQRS Rake in Section KM 72 to KM 90 (Down Main Line)',
        'Electronic Interlocking (EI) Software Verification at Kosi Kalan',
        'USFD High-Sensitivity Rail Testing across 120 Route Kilometers'
      ]
    },
    {
      week: 'Week 3 (Sep 24 – 30)',
      title: 'Traction Distribution Major Substation Overhaul',
      highlight: '132/25kV Grid Substation Transformer Maintenance in Coordination with NTPC Power Grid',
      impact: 'Corridor Capacity: 95.1% | Electric Haulage Protected via Parallel Feeder Feed',
      blocksCount: '26 Tactical Blocks',
      savings: '19.5 Track-Hours Saved',
      items: [
        'Kosi Kalan Traction Substation Overhaul & Circuit Breaker Testing',
        'Automatic Signalling System Audio Frequency Track Circuits (AFTC) Renewal',
        'TSR Speed Restriction Clearing Drive on 4 Curves'
      ]
    },
    {
      week: 'Week 4 (Oct 01 – 07)',
      title: 'Pre-Monsoon Track Drainage & Culvert Fortification',
      highlight: 'Waterway Desilting & Geosynthetic Formation Rehabilitation on Low-Lying Embankments',
      impact: 'Corridor Capacity: 96.4% | Flood Resilience Guaranteed under IMD High-Rainfall Forecast',
      blocksCount: '31 Tactical Blocks',
      savings: '24.2 Track-Hours Saved',
      items: [
        'Mechanized Drain Cleaning along KM 28 to KM 55 (Yamuna Basin Edge)',
        'Point Machine Heating Element & Weather Sealing Installation',
        'Special Freight Path Pre-booking for Post-Monsoon Agricultural Export'
      ]
    }
  ];

  const handleSimulateEmergency = () => {
    setEmergencyActive(!emergencyActive);
    if (!emergencyActive) {
      setSolveStatus({
        time: '0.42s (Emergency Re-Solve)',
        conflicts: 0,
        savedHours: '6.1 hrs',
        status: 'INCIDENT ADAPTED (CP-SAT Rescheduled)'
      });
    } else {
      setSolveStatus({
        time: '1.18s',
        conflicts: 0,
        savedHours: '4.5 hrs',
        status: 'OPTIMAL (CP-SAT v9.8)'
      });
    }
  };

  const filterBlocks = (blocks) => {
    if (selectedDept === 'all') return blocks;
    if (selectedDept === 'bundle') return blocks.filter(b => b.type === 'bundle');
    if (selectedDept === 'pway') return blocks.filter(b => b.type === 'pway' || b.type === 'bundle');
    if (selectedDept === 'snt') return blocks.filter(b => b.type === 'snt' || b.type === 'bundle');
    if (selectedDept === 'trd') return blocks.filter(b => b.type === 'trd' || b.type === 'bundle');
    if (selectedDept === 'passenger') return blocks.filter(b => b.type === 'passenger');
    if (selectedDept === 'freight') return blocks.filter(b => b.type === 'freight');
    return blocks;
  };

  return (
    <div className="dash-page">
      {/* Emergency Incident Banner */}
      {emergencyActive && (
        <div className="dash-incident-banner">
          <div className="dash-incident-banner__pulse"></div>
          <div className="dash-incident-banner__content">
            <strong>CRITICAL INCIDENT ALERT:</strong> Rail Fracture detected at KM 128.40 (UP Main Line). CP-SAT has executed automatic emergency re-solve: Diverted 12049 Gatimaan Express to DOWN line via SLW (Single Line Working), held BOXN Freight at Okhla loop, dispatched Emergency PWI Gang with PN-994112. Speed restriction: TSR 20 km/h active.
          </div>
          <button className="dash-incident-banner__btn" onClick={handleSimulateEmergency}>
            Acknowledge & Restore
          </button>
        </div>
      )}

      {/* Top Telemetry & Control Bar */}
      <header className="dash-header">
        <div className="dash-header__left">
          <div className="dash-header__division-tag">
            <span className="dash-header__dot"></span>
            NORTHERN RAILWAY • DELHI DIVISION (DLI)
          </div>
          <h1 className="dash-header__title">
            Corridor Block Controller <span>Command Center</span>
          </h1>
          <p className="dash-header__meta">
            Sahayak Rail Operational Interface • Real-Time Decision Support
          </p>
        </div>

        <div className="dash-header__actions">
          <div className="dash-horizon-toggle">
            <button
              className={`dash-horizon-btn ${selectedHorizon === '24h' ? 'active' : ''}`}
              onClick={() => setSelectedHorizon('24h')}
            >
              24-Hour Real-Time
            </button>
            <button
              className={`dash-horizon-btn ${selectedHorizon === '7d' ? 'active' : ''}`}
              onClick={() => setSelectedHorizon('7d')}
            >
              7-Day Tactical
            </button>
            <button
              className={`dash-horizon-btn ${selectedHorizon === '30d' ? 'active' : ''}`}
              onClick={() => setSelectedHorizon('30d')}
            >
              30-Day Strategic
            </button>
          </div>

          <button
            className={`dash-emergency-btn ${emergencyActive ? 'active' : ''}`}
            onClick={handleSimulateEmergency}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
            {emergencyActive ? 'Clear Fracture Alert' : 'Simulate Rail Fracture'}
          </button>
        </div>
      </header>

      {/* KPI Counters Strip */}
      <section className="dash-kpi-grid">
        <div className="dash-kpi-card">
          <div className="dash-kpi-card__label">Corridor Availability</div>
          <div className="dash-kpi-card__value text-cyan">94.8%</div>
          <div className="dash-kpi-card__sub">
            <span className="text-emerald">+3.2%</span> vs manual paper scheduling
          </div>
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-card__label">Track-Hours Saved Today</div>
          <div className="dash-kpi-card__value text-emerald">{solveStatus.savedHours}</div>
          <div className="dash-kpi-card__sub">Via cross-department shadow bundling</div>
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-card__label">Clashes Averted</div>
          <div className="dash-kpi-card__value text-amber">14 Auto-Resolved</div>
          <div className="dash-kpi-card__sub">Zero train detentions recorded</div>
        </div>

        <div className="dash-kpi-card">
          <div className="dash-kpi-card__label">Solver Engine</div>
          <div className="dash-kpi-card__value text-white">OR-Tools CP-SAT</div>
          <div className="dash-kpi-card__sub">
            Solved in <span className="text-cyan">{solveStatus.time}</span> • {solveStatus.status}
          </div>
        </div>
      </section>

      {/* 4-System Real-Time Ingestion Feeds (TMS, SMMS, TDMS, COA) */}
      <section className="dash-telemetry-bar">
        <div className="dash-telemetry-item">
          <span className="telemetry-badge status-live">● LIVE</span>
          <span className="telemetry-title">TMS (Track Mgmt)</span>
          <span className="telemetry-val">Defect Index: 0.12/km • 4 Welds Monitored</span>
        </div>
        <div className="dash-telemetry-item">
          <span className="telemetry-badge status-live">● LIVE</span>
          <span className="telemetry-title">SMMS (Signalling)</span>
          <span className="telemetry-val">Point Machines: 99.8% Healthy • 0 Interlock Failures</span>
        </div>
        <div className="dash-telemetry-item">
          <span className="telemetry-badge status-live">● LIVE</span>
          <span className="telemetry-title">TDMS (Traction/OHE)</span>
          <span className="telemetry-val">25kV Grid Synchronized • Catenary Tension Normal</span>
        </div>
        <div className="dash-telemetry-item">
          <span className="telemetry-badge status-live">● LIVE</span>
          <span className="telemetry-title">COA (Train Movement)</span>
          <span className="telemetry-val">18 Live Rakes in DLI Section • Zero Path Clashes</span>
        </div>
      </section>

      {/* View Horizon 1: 24-Hour Real-Time Gantt Chart */}
      {selectedHorizon === '24h' && (
        <>
          {/* Filter and Section Bar */}
          <section className="dash-toolbar">
            <div className="dash-toolbar__group">
              <label className="dash-toolbar__label">Corridor Section:</label>
              <select
                className="dash-select"
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
              >
                <option value="NDLS-AGC">Delhi – Agra Cantt (NDLS–AGC) • High-Speed Line</option>
                <option value="GZB-ALJN">Ghaziabad – Aligarh (GZB–ALJN) • Quad Track</option>
                <option value="CNB-LKO">Kanpur – Lucknow (CNB–LKO) • Mainline Corridor</option>
                <option value="JHS-GWL">Jhansi – Gwalior (JHS–GWL) • Grand Trunk Route</option>
              </select>
            </div>

            <div className="dash-toolbar__group">
              <label className="dash-toolbar__label">Filter Layer:</label>
              <div className="dash-filter-chips">
                <button
                  className={`dash-chip ${selectedDept === 'all' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('all')}
                >
                  All Movements
                </button>
                <button
                  className={`dash-chip dash-chip--bundle ${selectedDept === 'bundle' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('bundle')}
                >
                  ⭐ Shadow Bundles
                </button>
                <button
                  className={`dash-chip dash-chip--pway ${selectedDept === 'pway' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('pway')}
                >
                  P-Way (Engg)
                </button>
                <button
                  className={`dash-chip dash-chip--snt ${selectedDept === 'snt' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('snt')}
                >
                  S&T (Signals)
                </button>
                <button
                  className={`dash-chip dash-chip--trd ${selectedDept === 'trd' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('trd')}
                >
                  TRD (OHE 25kV)
                </button>
                <button
                  className={`dash-chip dash-chip--pass ${selectedDept === 'passenger' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('passenger')}
                >
                  Express Trains
                </button>
                <button
                  className={`dash-chip dash-chip--frt ${selectedDept === 'freight' ? 'active' : ''}`}
                  onClick={() => setSelectedDept('freight')}
                >
                  Freight Rakes
                </button>
              </div>
            </div>
          </section>

          {/* 24-Hour Multi-Track Interactive Gantt Chart */}
          <section className="dash-gantt-container">
            <div className="dash-gantt-header">
              <div className="dash-gantt-header__title">
                <span>24-Hour Corridor Possession & Traffic Timeline</span>
                <span className="dash-gantt-legend">
                  <span className="legend-item"><span className="legend-box bundle"></span> Shadow Block (Multi-Dept)</span>
                  <span className="legend-item"><span className="legend-box pway"></span> P-Way Track</span>
                  <span className="legend-item"><span className="legend-box snt"></span> S&T Signal</span>
                  <span className="legend-item"><span className="legend-box trd"></span> TRD OHE</span>
                  <span className="legend-item"><span className="legend-box passenger"></span> Express Trains</span>
                  <span className="legend-item"><span className="legend-box freight"></span> Freight Slots</span>
                </span>
              </div>
            </div>

            {/* Time Scale Bar */}
            <div className="dash-timescale">
              <div className="dash-track-label-col">Track Section / Line</div>
              <div className="dash-time-slots">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div key={i} className="dash-time-slot">
                    <span>{String(i).padStart(2, '0')}:00</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Corridors Tracks */}
            <div className="dash-tracks">
              {corridors.map((corridor) => (
                <div key={corridor.id} className={`dash-track-row ${emergencyActive && corridor.id === 'UP_MAIN' ? 'track-emergency' : ''}`}>
                  <div className="dash-track-info">
                    <div className="dash-track-info__name">
                      {corridor.name}
                      {emergencyActive && corridor.id === 'UP_MAIN' && (
                        <span className="emergency-badge">🚨 FRACTURE ALERT</span>
                      )}
                    </div>
                    <div className="dash-track-info__code">{corridor.code}</div>
                    <div className="dash-track-info__speed">
                      {emergencyActive && corridor.id === 'UP_MAIN' ? 'TSR 20 km/h (Emergency)' : corridor.speed}
                    </div>
                  </div>

                  <div className="dash-track-timeline">
                    {/* 1-hour grid vertical lines */}
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div
                        key={i}
                        className="dash-grid-line"
                        style={{ left: `${(i / 24) * 100}%` }}
                      />
                    ))}

                    {/* Blocks on this track */}
                    {filterBlocks(corridor.blocks).map((block) => {
                      const left = (block.start / 24) * 100;
                      const width = ((block.end - block.start) / 24) * 100;
                      const isSelected = activeBlock?.id === block.id;

                      return (
                        <div
                          key={block.id}
                          className={`dash-block-ribbon ribbon-${block.type} ${isSelected ? 'selected' : ''}`}
                          style={{ left: `${left}%`, width: `${width}%` }}
                          onClick={() => setActiveBlock(block)}
                          title={`${block.name} (${String(Math.floor(block.start)).padStart(2, '0')}:00 - ${String(Math.floor(block.end)).padStart(2, '0')}:00)`}
                        >
                          <div className="ribbon-text">{block.name}</div>
                          <div className="ribbon-time">
                            {String(Math.floor(block.start)).padStart(2, '0')}:{(block.start % 1 * 60).toFixed(0).padStart(2, '0')} - {String(Math.floor(block.end)).padStart(2, '0')}:{(block.end % 1 * 60).toFixed(0).padStart(2, '0')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </>
      )}

      {/* View Horizon 2: 7-Day Tactical Matrix */}
      {selectedHorizon === '7d' && (
        <section className="dash-tactical-container">
          <div className="dash-tactical-header">
            <div>
              <h2 className="dash-tactical-title">7-Day Tactical Maintenance Possession Matrix</h2>
              <p className="dash-tactical-sub">Division Master Rolling Plan • Multi-Department Machinery Allocation (IRPWM Para 808)</p>
            </div>
            <div className="dash-tactical-summary-tag">
              <span>Weekly Shadow Hours: <strong>26.4 hrs</strong></span>
              <span className="sep">•</span>
              <span>Efficiency Gain: <strong className="text-emerald">+27.4%</strong></span>
            </div>
          </div>

          <div className="dash-tactical-grid">
            {tacticalDays.map((item) => (
              <div key={item.code} className={`dash-tactical-card card-${item.type}`}>
                <div className="tactical-card__top">
                  <span className="tactical-card__day">{item.day}</span>
                  <span className={`tactical-card__status status-${item.type}`}>{item.status}</span>
                </div>

                <h3 className="tactical-card__title">{item.title}</h3>
                
                <div className="tactical-card__details">
                  <div className="tactical-detail-row">
                    <span className="label">Section / Track:</span>
                    <span className="val text-white">{item.section} ({item.track})</span>
                  </div>
                  <div className="tactical-detail-row">
                    <span className="label">Window / Duration:</span>
                    <span className="val text-cyan font-mono">{item.window}</span>
                  </div>
                  <div className="tactical-detail-row">
                    <span className="label">Department Scope:</span>
                    <span className="val text-amber">{item.dept}</span>
                  </div>
                  <div className="tactical-detail-row">
                    <span className="label">Private No & Caution:</span>
                    <span className="val text-emerald font-mono">{item.pn} • {item.tsr}</span>
                  </div>
                </div>

                <div className="tactical-card__footer">
                  <span className="tactical-saved-badge">⚡ {item.saved}</span>
                  <button 
                    className="tactical-action-btn"
                    onClick={() => onNavigate('field-dispatch')}
                  >
                    Permit T/348M →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* View Horizon 3: 30-Day Strategic Mega-Block Calendar */}
      {selectedHorizon === '30d' && (
        <section className="dash-strategic-container">
          <div className="dash-strategic-header">
            <div>
              <h2 className="dash-strategic-title">30-Day Strategic Mega-Block & Capital Works Window</h2>
              <p className="dash-strategic-sub">Macro-Level Corridor Capacity Retention & Freight Tonnage Protection Plan</p>
            </div>
            <div className="dash-strategic-summary-tag">
              <span>Planned Mega-Windows: <strong>4 Major Works</strong></span>
              <span className="sep">•</span>
              <span>Zero Freight Cancellations</span>
            </div>
          </div>

          <div className="dash-strategic-list">
            {strategicWeeks.map((week, idx) => (
              <div key={idx} className="dash-strategic-card">
                <div className="strategic-card__header">
                  <div className="strategic-card__week-badge">{week.week}</div>
                  <h3 className="strategic-card__title">{week.title}</h3>
                  <div className="strategic-card__meta">
                    <span className="blocks-count">{week.blocksCount}</span>
                    <span className="savings-count text-emerald">{week.savings}</span>
                  </div>
                </div>

                <div className="strategic-card__highlight">
                  <strong>⭐ Key Strategic Focus:</strong> {week.highlight}
                </div>

                <div className="strategic-card__impact">
                  <strong>Corridor Resilience:</strong> {week.impact}
                </div>

                <div className="strategic-card__items">
                  <span className="items-heading">Synchronized Machine & Grid Deployments:</span>
                  <ul>
                    {week.items.map((it, i) => (
                      <li key={i}>{it}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Selected Block Detailed Inspection Card */}
      {activeBlock && (
        <section className="dash-block-detail">
          <div className="dash-block-detail__header">
            <div>
              <div className="dash-block-detail__id">{activeBlock.id} • {activeBlock.dept}</div>
              <h3 className="dash-block-detail__title">{activeBlock.name}</h3>
            </div>
            <button className="dash-close-btn" onClick={() => setActiveBlock(null)}>✕ Close Inspector</button>
          </div>

          <div className="dash-block-detail__grid">
            <div className="detail-item">
              <span className="label">Kilometer Range:</span>
              <span className="value">{activeBlock.km}</span>
            </div>
            <div className="detail-item">
              <span className="label">Private Number (PN):</span>
              <span className="value text-cyan font-mono">{activeBlock.privateNo || 'N/A (Train Schedule)'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Caution Order (TSR):</span>
              <span className="value text-amber">{activeBlock.tsr}</span>
            </div>
            <div className="detail-item">
              <span className="label">Track Time Saved:</span>
              <span className="value text-emerald">{activeBlock.hoursSaved || 'Optimized by CP-SAT'}</span>
            </div>
          </div>

          <div className="dash-block-detail__notes">
            <strong>Operational Directives:</strong> {activeBlock.details}
          </div>

          <div className="dash-block-detail__actions">
            <button className="dash-action-btn primary" onClick={() => onNavigate('field-dispatch')}>
              Generate Form T/348M Permit
            </button>
            <button className="dash-action-btn secondary" onClick={() => onNavigate('optimizer')}>
              Inspect Solver Constraints
            </button>
            <button className="dash-action-btn secondary" onClick={() => onNavigate('audit')}>
              View XAI Explainability (SHAP)
            </button>
          </div>
        </section>
      )}

      {/* Quick Navigation Footer Links */}
      <footer className="dash-footer-nav">
        <div className="dash-footer-nav__item" onClick={() => onNavigate('optimizer')}>
          <div className="num">02</div>
          <div>
            <strong>AI Constraint Optimizer</strong>
            <p>Multi-department shadow bundling and CP-SAT engine</p>
          </div>
        </div>

        <div className="dash-footer-nav__item" onClick={() => onNavigate('freight')}>
          <div className="num">03</div>
          <div>
            <strong>Freight Forecaster (USP #2)</strong>
            <p>data.gov.in predictive goods-train scheduling</p>
          </div>
        </div>

        <div className="dash-footer-nav__item" onClick={() => onNavigate('field-dispatch')}>
          <div className="num">04</div>
          <div>
            <strong>Field SMS Terminal (USP #1)</strong>
            <p>Low-connectivity gangman 2G dispatch & Form T/348M</p>
          </div>
        </div>

        <div className="dash-footer-nav__item" onClick={() => onNavigate('weather')}>
          <div className="num">05</div>
          <div>
            <strong>Weather & Safety Radar (USP #3)</strong>
            <p>IMD monsoon, flood & temperature resilience</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
