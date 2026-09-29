import React, { useState } from 'react';
import './OptimizerPage.css';

export default function OptimizerPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pway' | 'snt' | 'trd' | 'bids'
  const [isSolving, setIsSolving] = useState(false);
  const [solverResult, setSolverResult] = useState(null);
  const [weights, setWeights] = useState({
    punctuality: 45,
    safety: 35,
    utilization: 20
  });

  const [bundleStatus, setBundleStatus] = useState('pending'); // pending, approved, modified

  // USP #4: Cross-Department Bids State
  const [bids, setBids] = useState([
    {
      id: 'BID-ENG-101',
      dept: 'Engineering (P-Way)',
      deptClass: 'pway',
      section: 'KM 127.40 – 128.80 (UP Main)',
      activity: 'CSM-92 Mechanised Track Tamping',
      requestedHours: 3.0,
      urgency: 'Critical (TGI 52)',
      status: 'BUNDLED IN SHADOW BLOCK'
    },
    {
      id: 'BID-SNT-102',
      dept: 'Signal & Telecom (S&T)',
      deptClass: 'snt',
      section: 'KM 128.10 (Palwal Outer)',
      activity: 'Point Machine 104-A Overhaul & Testing',
      requestedHours: 2.0,
      urgency: 'High (Overdue 14 Days)',
      status: 'BUNDLED IN SHADOW BLOCK'
    },
    {
      id: 'BID-TRD-103',
      dept: 'Electrical (TRD / OHE)',
      deptClass: 'trd',
      section: 'KM 126.50 – 129.50',
      activity: '25kV Catenary Stagger Alignment & Wash',
      requestedHours: 2.5,
      urgency: 'Medium (Stagger 240mm)',
      status: 'BUNDLED IN SHADOW BLOCK'
    },
    {
      id: 'BID-OPT-104',
      dept: 'Operating (Traffic)',
      deptClass: 'pway',
      section: 'KM 127.00 – 128.50',
      activity: 'Turnout Diamond Clearance & Lubrication',
      requestedHours: 1.5,
      urgency: 'Routine Monthly',
      status: 'BUNDLED IN SHADOW BLOCK'
    }
  ]);

  const [newBid, setNewBid] = useState({
    dept: 'Engineering (P-Way)',
    section: 'KM 128.00 – 129.00',
    activity: 'Rail Joint Weld Ultrasonic Test',
    hours: 2.0,
    urgency: 'High'
  });

  const rawDefects = [
    {
      id: 'TMS-9402',
      dept: 'TMS (P-Way)',
      deptClass: 'pway',
      location: 'NDLS–AGC KM 127.40 – 128.80',
      system: 'Track Management System',
      description: 'Track Geometry Index (TGI) dropped to 52. Urgent mechanised tamping required.',
      metric: 'TGI: 52 (Crit: <55)',
      duration: '3.0 Hours',
      priority: 94,
      regulation: 'IRPWM Para 808'
    },
    {
      id: 'SMMS-3184',
      dept: 'SMMS (S&T)',
      deptClass: 'snt',
      location: 'NDLS–AGC KM 128.10 (Palwal Outer)',
      system: 'Signal Maint. Mgmt System',
      description: 'Electric Point Machine 104-A ground rodding & lock detector wear inspection.',
      metric: 'Overdue: 14 Days',
      duration: '2.0 Hours',
      priority: 88,
      regulation: 'IRSEM Section 3'
    },
    {
      id: 'TDMS-7102',
      dept: 'TDMS (TRD)',
      deptClass: 'trd',
      location: 'NDLS–AGC KM 126.50 – 129.50',
      system: 'Traction Distribution System',
      description: '25kV Catenary contact wire height & stagger laser measurement + insulator cleaning.',
      metric: 'Stagger: 240mm (Max: 200mm)',
      duration: '2.5 Hours',
      priority: 82,
      regulation: 'ACTM Vol II Para 2063'
    },
    {
      id: 'TMS-9415',
      dept: 'TMS (P-Way)',
      deptClass: 'pway',
      location: 'GZB–ALJN KM 64.20 – 68.00',
      system: 'Track Management System',
      description: 'USFD Ultrasonic rail testing detected IMR (Immediate Rail Replacement) flaw.',
      metric: 'USFD Flaw: IMR Grade',
      duration: '2.5 Hours',
      priority: 96,
      regulation: 'USFD Manual 2022'
    },
    {
      id: 'SMMS-3209',
      dept: 'SMMS (S&T)',
      deptClass: 'snt',
      location: 'CNB–LKO KM 38.50',
      system: 'Signal Maint. Mgmt System',
      description: 'Axle Counter track sensor replacement and multi-core signalling cable meggering.',
      metric: 'Axle Count Drift: 4%',
      duration: '1.5 Hours',
      priority: 75,
      regulation: 'SEM Para 14.3'
    }
  ];

  const filteredDefects = activeTab === 'all' 
    ? rawDefects 
    : rawDefects.filter(d => d.deptClass === activeTab);

  const handleAddBid = (e) => {
    e.preventDefault();
    const bidItem = {
      id: `BID-${newBid.dept.slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`,
      dept: newBid.dept,
      deptClass: newBid.dept.includes('P-Way') ? 'pway' : newBid.dept.includes('Signal') ? 'snt' : 'trd',
      section: newBid.section,
      activity: newBid.activity,
      requestedHours: Number(newBid.hours),
      urgency: newBid.urgency,
      status: 'CO-LOCATED & BUNDLED'
    };
    setBids([...bids, bidItem]);
    alert(`Bid ${bidItem.id} submitted! AI CP-SAT solver successfully co-located it into Shadow Block #104 without increasing track possession time.`);
  };

  const runSolver = () => {
    setIsSolving(true);
    setSolverResult(null);

    setTimeout(() => {
      setIsSolving(false);
      setSolverResult({
        status: 'OPTIMAL SOLUTION FOUND',
        solveTime: '1.14s',
        variables: 4280,
        constraints: 7640,
        bundleSavings: '5.5 Track-Hours Saved',
        passengerDelayAverted: '145 Train-Minutes',
        allocatedWindow: '00:30 – 04:00 (3.5 Hours)',
        allocatedDate: 'Tomorrow (Wed, 10-Sep-2026)',
        privateNumber: 'PN-884102-DLI'
      });
    }, 1200);
  };

  const totalSiloedHours = bids.reduce((acc, b) => acc + b.requestedHours, 0);
  const bundledHours = 3.5;
  const hoursSaved = (totalSiloedHours - bundledHours).toFixed(1);

  return (
    <div className="optimizer-page">
      <header className="opt-header">
        <div className="opt-header__left">
          <div className="opt-header__badge">
            <span className="opt-header__dot"></span>
            GOOGLE OR-TOOLS CP-SAT CONSTRAINT SOLVER ENGINE • HACKWAVE 3.0
          </div>
          <h1 className="opt-header__title">
            AI Maintenance Block <span>Optimizer & Bundler</span>
          </h1>
          <p className="opt-header__subtitle">
            Sahayak Rail ingests live TMS, SMMS, TDMS maintenance feeds and mathematically consolidates siloed closures into synchronized "Shadow Blocks".
          </p>
        </div>

        <div className="opt-header__actions">
          <button className="opt-btn-secondary" onClick={() => onNavigate('dashboard')}>
            ← Back to Gantt Timeline
          </button>
          <button className="opt-btn-primary" onClick={runSolver} disabled={isSolving}>
            {isSolving ? (
              <span className="opt-spinner">Solving CP-SAT...</span>
            ) : (
              <>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                </svg>
                Run OR-Tools Optimizer
              </>
            )}
          </button>
        </div>
      </header>

      {/* Solver Solving Animation Modal / Banner */}
      {isSolving && (
        <div className="opt-solving-banner">
          <div className="opt-solving-banner__bar"></div>
          <div className="opt-solving-banner__text">
            <strong>CP-SAT MILP SOLVER EXECUTING:</strong> Evaluating 4,280 timetable variables • Enforcing OHE 25kV power isolation rules • Optimizing multi-department co-location constraints...
          </div>
        </div>
      )}

      {/* Showcase: Siloed vs Bundled Shadow Block */}
      <section className="opt-bundling-showcase">
        <div className="opt-showcase-card opt-showcase-card--siloed">
          <div className="opt-showcase-card__tag text-amber">TRADITIONAL SILOED DISPATCH (MANUAL)</div>
          <h3 className="opt-showcase-card__title">4 Separate Closures Across 4 Days</h3>
          <p className="opt-showcase-card__desc">
            Departments submit block requests independently via paper/Excel memos. Section is repeatedly closed and reopened:
          </p>
          <div className="opt-silo-timeline">
            <div className="silo-item pway">
              <span className="day">Monday</span>
              <span className="content">P-Way Tamping: 3.0h block (KM 127–128)</span>
            </div>
            <div className="silo-item snt">
              <span className="day">Tuesday</span>
              <span className="content">S&T Point Machine: 2.0h block (KM 128)</span>
            </div>
            <div className="silo-item trd">
              <span className="day">Wednesday</span>
              <span className="content">TRD 25kV OHE Catenary: 2.5h block (KM 126–129)</span>
            </div>
            <div className="silo-item pway">
              <span className="day">Thursday</span>
              <span className="content">Traffic Turnout Clearance: 1.5h block</span>
            </div>
          </div>
          <div className="opt-silo-total">
            Total Track Closed: <strong>9.0 Hours across 4 Days</strong>
          </div>
        </div>

        <div className="opt-showcase-card opt-showcase-card--bundled">
          <div className="opt-showcase-card__tag text-emerald">SAHAYAK RAIL SHADOW BUNDLE (OR-TOOLS)</div>
          <h3 className="opt-showcase-card__title">Synchronized 1-Window Possession</h3>
          <p className="opt-showcase-card__desc">
            OR-Tools CP-SAT identifies physical co-location and bundles all 4 departments into a single night possession:
          </p>
          <div className="opt-bundled-box">
            <div className="bundled-badge">SHADOW BLOCK #104 · PALWAL SECTION</div>
            <div className="bundled-time">00:30 AM – 04:00 AM (3.5 Hours Total)</div>
            <div className="bundled-stripes">
              <span className="pway">CSM Tamping</span>
              <span className="snt">Point 104-A</span>
              <span className="trd">OHE 25kV Wash</span>
              <span className="pway">Diamond Clear</span>
            </div>
            <div className="bundled-result">
              <div className="stat">
                <span className="val text-emerald">5.5 Hours</span>
                <span className="lbl">Track Time Saved (61% Reduction)</span>
              </div>
              <div className="stat">
                <span className="val text-cyan">Zero</span>
                <span className="lbl">Express Train Cancellations</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Solver Result Banner */}
      {solverResult && (
        <section className="opt-result-section">
          <div className="opt-result-header">
            <div>
              <span className="status-pill text-emerald">● {solverResult.status}</span>
              <h2>CP-SAT Optimization Proof & Allocation</h2>
            </div>
            <div className="private-number-badge">
              <span>CRIS PRIVATE NUMBER</span>
              <strong>{solverResult.privateNumber}</strong>
            </div>
          </div>

          <div className="opt-result-grid">
            <div className="res-card">
              <span className="res-card__label">Solution Time</span>
              <span className="res-card__value text-cyan">{solverResult.solveTime}</span>
              <span className="res-card__meta">{solverResult.variables} decision vars</span>
            </div>
            <div className="res-card">
              <span className="res-card__label">Track Time Saved</span>
              <span className="res-card__value text-emerald">{solverResult.bundleSavings}</span>
              <span className="res-card__meta">Single shared possession</span>
            </div>
            <div className="res-card">
              <span className="res-card__label">Passenger Delay Averted</span>
              <span className="res-card__value text-amber">{solverResult.passengerDelayAverted}</span>
              <span className="res-card__meta">12049 Gatimaan protected</span>
            </div>
            <div className="res-card">
              <span className="res-card__label">Allocated Window</span>
              <span className="res-card__value text-white">{solverResult.allocatedWindow}</span>
              <span className="res-card__meta">{solverResult.allocatedDate}</span>
            </div>
          </div>

          {/* Human-in-the-Loop Actions */}
          <div className="opt-governance-bar">
            <div className="opt-governance-bar__info">
              <strong>Human-in-the-Loop Governance:</strong> Section Controller retains absolute authority to approve, adjust, or decline AI recommendations.
            </div>
            <div className="opt-governance-bar__buttons">
              <button 
                className={`gov-btn approve ${bundleStatus === 'approved' ? 'active' : ''}`}
                onClick={() => setBundleStatus('approved')}
              >
                {bundleStatus === 'approved' ? '✓ Approved by Controller' : 'Approve & Issue PN'}
              </button>
              <button 
                className="gov-btn modify"
                onClick={() => alert('Window Adjustment dialog: You can nudge window by ±30 minutes as per G&SR rules.')}
              >
                Adjust Window
              </button>
              <button 
                className="gov-btn reject"
                onClick={() => setBundleStatus('rejected')}
              >
                Decline & Re-Solve
              </button>
              <button 
                className="gov-btn primary"
                onClick={() => onNavigate('field-dispatch')}
              >
                Dispatch via SMS / PTW →
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Solver Configuration & Weights */}
      <section className="opt-weights-section">
        <div className="opt-weights-header">
          <h3>CP-SAT Multi-Objective Objective Function Weights</h3>
          <p>Configure prioritization parameters for the lexicographic integer programming solver.</p>
        </div>

        <div className="opt-sliders-grid">
          <div className="opt-slider-card">
            <div className="slider-label">
              <span>Passenger Train Punctuality</span>
              <strong>{weights.punctuality}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={weights.punctuality}
              onChange={(e) => setWeights({ ...weights, punctuality: Number(e.target.value) })}
            />
            <p className="slider-desc">Penalizes delays to high-precedence Rajdhani, Shatabdi, and Vande Bharat trains.</p>
          </div>

          <div className="opt-slider-card">
            <div className="slider-label">
              <span>Asset Safety & Urgency (TGI/USFD)</span>
              <strong>{weights.safety}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="70"
              value={weights.safety}
              onChange={(e) => setWeights({ ...weights, safety: Number(e.target.value) })}
            />
            <p className="slider-desc">Prioritizes critical track geometry defects under IRPWM Para 808.</p>
          </div>

          <div className="opt-slider-card">
            <div className="slider-label">
              <span>Crew & Machine Utilization</span>
              <strong>{weights.utilization}%</strong>
            </div>
            <input
              type="range"
              min="10"
              max="50"
              value={weights.utilization}
              onChange={(e) => setWeights({ ...weights, utilization: Number(e.target.value) })}
            />
            <p className="slider-desc">Maximizes output of high-cost machinery (CSM tamping, BCM screening).</p>
          </div>
        </div>
      </section>

      {/* Multi-System Ingestion & USP #4 Cross-Department Bidding */}
      <section className="opt-defects-section">
        <div className="opt-defects-header">
          <div>
            <h3>Multi-Department Maintenance Ingestion Stream</h3>
            <p>Direct real-time API sync with CRIS Railway Databases & Collaborative Bidding</p>
          </div>

          <div className="opt-tabs">
            <button className={`opt-tab ${activeTab === 'all' ? 'active' : ''}`} onClick={() => setActiveTab('all')}>
              All Ingested (5)
            </button>
            <button className={`opt-tab ${activeTab === 'bids' ? 'active' : ''}`} onClick={() => setActiveTab('bids')}>
              Cross-Dept Bidding (USP #4) 🔥
            </button>
            <button className={`opt-tab ${activeTab === 'pway' ? 'active' : ''}`} onClick={() => setActiveTab('pway')}>
              TMS (P-Way)
            </button>
            <button className={`opt-tab ${activeTab === 'snt' ? 'active' : ''}`} onClick={() => setActiveTab('snt')}>
              SMMS (Signals)
            </button>
            <button className={`opt-tab ${activeTab === 'trd' ? 'active' : ''}`} onClick={() => setActiveTab('trd')}>
              TDMS (Traction)
            </button>
          </div>
        </div>

        {/* USP #4: Cross-Department Bidding Mechanism Panel */}
        {activeTab === 'bids' ? (
          <div className="opt-bids-container">
            <div className="opt-bids-summary">
              <div className="opt-bids-card">
                <span className="opt-bids-card__lbl">Active Department Bids</span>
                <span className="opt-bids-card__val text-cyan">{bids.length} Departments</span>
                <span className="opt-bids-card__sub">Corridor: NDLS–AGC (KM 126–130)</span>
              </div>
              <div className="opt-bids-card">
                <span className="opt-bids-card__lbl">Siloed Requests Total</span>
                <span className="opt-bids-card__val text-amber">{totalSiloedHours} Hours</span>
                <span className="opt-bids-card__sub">Across {bids.length} separate days</span>
              </div>
              <div className="opt-bids-card">
                <span className="opt-bids-card__lbl">AI Bundled Window</span>
                <span className="opt-bids-card__val text-emerald">{bundledHours} Hours</span>
                <span className="opt-bids-card__sub">00:30 – 04:00 AM Shared Possession</span>
              </div>
              <div className="opt-bids-card">
                <span className="opt-bids-card__lbl">Track-Hours Saved Metric</span>
                <span className="opt-bids-card__val text-emerald">+{hoursSaved} Hours</span>
                <span className="opt-bids-card__sub">{((hoursSaved / totalSiloedHours) * 100).toFixed(0)}% Line Closure Reduction</span>
              </div>
            </div>

            {/* Bids Table */}
            <div className="opt-defects-table-wrapper" style={{ marginTop: '16px' }}>
              <table className="opt-defects-table">
                <thead>
                  <tr>
                    <th>Bid ID</th>
                    <th>Department</th>
                    <th>Corridor Location</th>
                    <th>Proposed Maintenance Activity</th>
                    <th>Duration</th>
                    <th>Urgency Level</th>
                    <th>Co-Scheduling Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bids.map((b) => (
                    <tr key={b.id}>
                      <td className="font-mono text-cyan">{b.id}</td>
                      <td><span className={`dept-pill ${b.deptClass}`}>{b.dept}</span></td>
                      <td><strong>{b.section}</strong></td>
                      <td>{b.activity}</td>
                      <td><strong>{b.requestedHours}h</strong></td>
                      <td><span className="metric-tag">{b.urgency}</span></td>
                      <td><span className="status-pill text-emerald">● {b.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Submit New Bid Form */}
            <div className="opt-new-bid-card">
              <h4>Submit New Cross-Department Bidding Request</h4>
              <form onSubmit={handleAddBid} className="opt-new-bid-form">
                <div className="opt-bid-field">
                  <label>Department</label>
                  <select 
                    value={newBid.dept}
                    onChange={(e) => setNewBid({ ...newBid, dept: e.target.value })}
                  >
                    <option value="Engineering (P-Way)">Engineering (P-Way)</option>
                    <option value="Signal & Telecom (S&T)">Signal & Telecom (S&T)</option>
                    <option value="Electrical (TRD / OHE)">Electrical (TRD / OHE)</option>
                    <option value="Operating (Traffic)">Operating (Traffic)</option>
                  </select>
                </div>
                <div className="opt-bid-field">
                  <label>Section KM Range</label>
                  <input 
                    type="text" 
                    value={newBid.section} 
                    onChange={(e) => setNewBid({ ...newBid, section: e.target.value })} 
                    placeholder="e.g. KM 127.40 – 128.80" 
                    required 
                  />
                </div>
                <div className="opt-bid-field">
                  <label>Activity Description</label>
                  <input 
                    type="text" 
                    value={newBid.activity} 
                    onChange={(e) => setNewBid({ ...newBid, activity: e.target.value })} 
                    placeholder="e.g. Point Machine Servicing" 
                    required 
                  />
                </div>
                <div className="opt-bid-field" style={{ maxWidth: '120px' }}>
                  <label>Duration (Hours)</label>
                  <input 
                    type="number" 
                    step="0.5" 
                    min="1" 
                    max="6" 
                    value={newBid.hours} 
                    onChange={(e) => setNewBid({ ...newBid, hours: e.target.value })} 
                    required 
                  />
                </div>
                <div className="opt-bid-field">
                  <label>Urgency</label>
                  <select 
                    value={newBid.urgency}
                    onChange={(e) => setNewBid({ ...newBid, urgency: e.target.value })}
                  >
                    <option value="Critical">Critical (Immediate SOP)</option>
                    <option value="High">High (Within 48h)</option>
                    <option value="Medium">Medium (Within 7 Days)</option>
                    <option value="Routine">Routine Maintenance</option>
                  </select>
                </div>
                <button type="submit" className="opt-btn-primary" style={{ alignSelf: 'flex-end', height: '42px' }}>
                  Submit Bid to AI Pool
                </button>
              </form>
            </div>
          </div>
        ) : (
          <div className="opt-defects-table-wrapper">
            <table className="opt-defects-table">
              <thead>
                <tr>
                  <th>Defect ID</th>
                  <th>System</th>
                  <th>Location / Section</th>
                  <th>Technical Diagnostics</th>
                  <th>Severity Metric</th>
                  <th>Required Block</th>
                  <th>Safety Standard</th>
                  <th>Urgency</th>
                </tr>
              </thead>
              <tbody>
                {filteredDefects.map((d) => (
                  <tr key={d.id}>
                    <td className="font-mono text-cyan">{d.id}</td>
                    <td><span className={`dept-pill ${d.deptClass}`}>{d.dept}</span></td>
                    <td><strong>{d.location}</strong></td>
                    <td className="desc-cell">{d.description}</td>
                    <td><span className="metric-tag">{d.metric}</span></td>
                    <td>{d.duration}</td>
                    <td className="text-muted font-mono">{d.regulation}</td>
                    <td>
                      <div className="priority-bar-wrap">
                        <div className="priority-bar" style={{ width: `${d.priority}%` }}></div>
                        <span>{d.priority}/100</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
