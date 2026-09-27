import React, { useState } from 'react';
import { MOCK_REQUESTS } from './COADashboardPage';
import './COARequestsPage.css';

/* ── helpers ───────────────────────────────────────── */
const DEPT_COLOR  = { pway: '#10B981', snt: '#F59E0B', trd: '#8B5CF6' };
const URGENCY_COLOR = { Critical: '#EF4444', High: '#F59E0B', Medium: '#3B82F6' };

const PIPELINE_STAGES = [
  { key: 'INCOMING',       icon: '📥', label: 'Incoming',        desc: 'Request received, awaiting processing' },
  { key: 'AI_PROCESSING',  icon: '🤖', label: 'AI Segregation',  desc: 'Prioritised by AI scoring engine' },
  { key: 'OPTIMISER_DONE', icon: '⚙️', label: 'Optimiser Report', desc: 'CP-SAT solver has proposed a window' },
  { key: 'FINALISED',      icon: '✅', label: 'Finalised',        desc: 'Block allocated & PN issued' },
];

/* Simulated AI segregation report for any request */
function aiReport(req) {
  const urgencyScore = req.urgency === 'Critical' ? 94 : req.urgency === 'High' ? 82 : 68;
  return {
    priorityScore: urgencyScore,
    reasoning: `Regulation ${req.regulation} mandates maintenance within ${req.urgency === 'Critical' ? '72 hrs' : req.urgency === 'High' ? '7 days' : '30 days'}. Section traffic density permits a night window. Co-location potential with adjacent departmental requests detected.`,
    factors: [
      { name: 'Defect / Overdue Urgency', pct: req.urgency === 'Critical' ? 42 : 32 },
      { name: 'Regulatory Compliance Deadline', pct: 28 },
      { name: 'Section Traffic Density', pct: 18 },
      { name: 'Machine / Crew Proximity', pct: 12 },
    ],
    recommendation: req.urgency === 'Critical' ? 'Send to Optimiser immediately.' : 'Can be batched with upcoming window.',
  };
}

/* Simulated optimiser report */
function optimiserReport(req) {
  return {
    proposedWindow: req.allocatedWindow || '01:00–03:30',
    bundledWith: req.deptClass === 'pway' ? ['S&T Point overhaul (if co-located)'] : [],
    siloedHours: parseFloat(req.duration),
    bundledHours: Math.max(parseFloat(req.duration) - 0.5, 1.5),
    savedHours: 0.5,
    constraints: [
      '15-min safety headway preserved before/after express trains',
      `${req.regulation} compliance verified`,
      'No OHE energisation conflicts detected',
    ],
    solveTime: '1.14s',
    variables: 4280,
  };
}

/* ── component ─────────────────────────────────────── */
export default function COARequestsPage({ onNavigate, currentUser }) {
  const [requests, setRequests] = useState(MOCK_REQUESTS);
  const [selectedId, setSelectedId] = useState(null);
  const [filterStage, setFilterStage]   = useState('ALL');
  const [expandedAI,  setExpandedAI]    = useState({});
  const [expandedOpt, setExpandedOpt]   = useState({});

  const selected = requests.find(r => r.id === selectedId);

  /* transition helpers */
  const moveToAI = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'AI_PROCESSING' } : r));
    setExpandedAI(prev => ({ ...prev, [id]: true }));
  };
  const moveToOptimiser = (id) => {
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status: 'OPTIMISER_DONE' } : r));
    setExpandedOpt(prev => ({ ...prev, [id]: true }));
  };
  const finalise = (id) => {
    const pn = `PN-${Math.floor(100000 + Math.random() * 899999)}-DLI`;
    setRequests(prev => prev.map(r =>
      r.id === id
        ? { ...r, status: 'FINALISED', privateNo: pn, allocatedWindow: optimiserReport(r).proposedWindow }
        : r
    ));
    setExpandedOpt(prev => ({ ...prev, [id]: false }));
  };

  /* filter */
  const visible = filterStage === 'ALL'
    ? requests
    : requests.filter(r => r.status === filterStage);

  const stageCount = (key) => requests.filter(r => r.status === key).length;

  return (
    <div className="coa-req-page">
      {/* ── Header ───────────────────────────────────── */}
      <header className="coa-req-page__header">
        <div>
          <div className="coa-badge">
            <span className="coa-badge__dot"></span>
            COA • MAINTENANCE BLOCK REQUEST PIPELINE
          </div>
          <h1 className="coa-req-page__title">
            Block Request <span>Management</span>
          </h1>
          <p className="coa-req-page__meta">
            Review incoming requests, run AI prioritisation, send to optimiser and finalise block allocations.
          </p>
        </div>
        <div className="coa-req-page__actions">
          <button className="coa-btn-outline" onClick={() => onNavigate('coa-dashboard')}>
            ← Dashboard
          </button>
          <button className="coa-btn-primary" onClick={() => onNavigate('coa-schedule')}>
            View Final Schedule →
          </button>
        </div>
      </header>

      {/* ── Pipeline Stage Tabs ──────────────────────── */}
      <div className="coa-pipeline-tabs">
        <button
          className={`coa-pipeline-tab ${filterStage === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilterStage('ALL')}
        >
          All Requests
          <span className="coa-tab-count">{requests.length}</span>
        </button>
        {PIPELINE_STAGES.map(st => (
          <button
            key={st.key}
            className={`coa-pipeline-tab ${filterStage === st.key ? 'active' : ''}`}
            onClick={() => setFilterStage(st.key)}
          >
            {st.icon} {st.label}
            <span className="coa-tab-count">{stageCount(st.key)}</span>
          </button>
        ))}
      </div>

      {/* ── Pipeline visual bar ──────────────────────── */}
      <div className="coa-pipeline-bar">
        {PIPELINE_STAGES.map((st, i) => (
          <React.Fragment key={st.key}>
            <div className={`coa-pipe-step ${stageCount(st.key) > 0 ? 'has-items' : ''}`}>
              <span className="coa-pipe-step__icon">{st.icon}</span>
              <div>
                <div className="coa-pipe-step__label">{st.label}</div>
                <div className="coa-pipe-step__count">{stageCount(st.key)} requests</div>
              </div>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <div className="coa-pipe-arrow">→</div>}
          </React.Fragment>
        ))}
      </div>

      {/* ── Request Cards ────────────────────────────── */}
      <div className="coa-req-cards">
        {visible.length === 0 && (
          <div className="coa-empty">No requests in this stage.</div>
        )}

        {visible.map(req => {
          const ai  = aiReport(req);
          const opt = optimiserReport(req);
          const showAI  = expandedAI[req.id]  || req.status === 'AI_PROCESSING' || req.status === 'OPTIMISER_DONE' || req.status === 'FINALISED';
          const showOpt = expandedOpt[req.id] || req.status === 'OPTIMISER_DONE' || req.status === 'FINALISED';

          return (
            <div key={req.id} className={`coa-req-card coa-req-card--${req.status.toLowerCase()}`}>
              {/* Card top row */}
              <div className="coa-req-card__top">
                <div className="coa-req-card__left">
                  <span className="coa-req-card__id font-mono">{req.id}</span>
                  <span
                    className="coa-req-card__dept"
                    style={{ background: `${DEPT_COLOR[req.deptClass]}22`, color: DEPT_COLOR[req.deptClass] }}
                  >
                    {req.dept}
                  </span>
                  <span
                    className="coa-req-card__urgency"
                    style={{ color: URGENCY_COLOR[req.urgency] }}
                  >
                    ● {req.urgency}
                  </span>
                </div>
                <div className="coa-req-card__right">
                  <span className={`coa-stage-pill coa-stage-pill--${req.status.toLowerCase()}`}>
                    {{ INCOMING: '📥 Incoming', AI_PROCESSING: '🤖 AI Segregation', OPTIMISER_DONE: '⚙️ Optimiser Done', FINALISED: '✅ Finalised' }[req.status]}
                  </span>
                </div>
              </div>

              {/* Core details */}
              <div className="coa-req-card__body">
                <div className="coa-req-card__activity">{req.activity}</div>
                <div className="coa-req-card__details">
                  <span>📍 {req.section}</span>
                  <span>⏱ {req.duration}</span>
                  <span>📋 {req.regulation}</span>
                  <span>🕐 Submitted: {req.submittedAt}</span>
                </div>
              </div>

              {/* ── AI Segregation Report ─────────────── */}
              {showAI && (
                <div className="coa-ai-report">
                  <div className="coa-ai-report__header">
                    <span className="coa-ai-report__title">🤖 AI Segregation Report</span>
                    <span className="coa-ai-report__score">Priority Score: <strong style={{ color: '#F59E0B' }}>{ai.priorityScore}/100</strong></span>
                  </div>
                  <p className="coa-ai-report__reasoning">{ai.reasoning}</p>
                  <div className="coa-ai-factors">
                    {ai.factors.map((f, i) => (
                      <div key={i} className="coa-ai-factor">
                        <div className="coa-ai-factor__row">
                          <span>{f.name}</span>
                          <span className="font-mono">{f.pct}%</span>
                        </div>
                        <div className="coa-ai-factor__bar">
                          <div className="coa-ai-factor__fill" style={{ width: `${f.pct}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="coa-ai-report__rec">
                    <strong>Recommendation:</strong> {ai.recommendation}
                  </div>
                </div>
              )}

              {/* ── Optimiser Report ─────────────────── */}
              {showOpt && (
                <div className="coa-opt-report">
                  <div className="coa-opt-report__header">
                    <span className="coa-opt-report__title">⚙️ Optimiser (CP-SAT) Report</span>
                    <span className="coa-opt-report__badge">Solved in {opt.solveTime}</span>
                  </div>
                  <div className="coa-opt-stats">
                    <div className="coa-opt-stat">
                      <span className="coa-opt-stat__val" style={{ color: '#3B82F6' }}>{opt.proposedWindow}</span>
                      <span className="coa-opt-stat__lbl">Proposed Window</span>
                    </div>
                    <div className="coa-opt-stat">
                      <span className="coa-opt-stat__val" style={{ color: '#EF4444' }}>{opt.siloedHours}h</span>
                      <span className="coa-opt-stat__lbl">If Siloed</span>
                    </div>
                    <div className="coa-opt-stat">
                      <span className="coa-opt-stat__val" style={{ color: '#10B981' }}>{opt.bundledHours}h</span>
                      <span className="coa-opt-stat__lbl">Bundled Window</span>
                    </div>
                    <div className="coa-opt-stat">
                      <span className="coa-opt-stat__val" style={{ color: '#10B981' }}>+{opt.savedHours}h saved</span>
                      <span className="coa-opt-stat__lbl">Track Time Saved</span>
                    </div>
                  </div>
                  <ul className="coa-opt-constraints">
                    {opt.constraints.map((c, i) => (
                      <li key={i}>✓ {c}</li>
                    ))}
                  </ul>
                  {opt.bundledWith.length > 0 && (
                    <div className="coa-opt-bundle">
                      Co-located with: {opt.bundledWith.join(', ')}
                    </div>
                  )}
                </div>
              )}

              {/* Finalised summary */}
              {req.status === 'FINALISED' && (
                <div className="coa-finalised-row">
                  <span>✅ Block allocated</span>
                  <span>🕐 Window: <strong>{req.allocatedWindow}</strong></span>
                  <span>🔑 PN: <strong className="font-mono">{req.privateNo}</strong></span>
                </div>
              )}

              {/* ── Action Buttons ────────────────────── */}
              <div className="coa-req-card__actions">
                {req.status === 'INCOMING' && (
                  <button className="coa-action-btn coa-action-btn--ai" onClick={() => moveToAI(req.id)}>
                    🤖 Move to AI Segregation
                  </button>
                )}
                {req.status === 'AI_PROCESSING' && (
                  <button className="coa-action-btn coa-action-btn--opt" onClick={() => moveToOptimiser(req.id)}>
                    ⚙️ Send to Optimiser
                  </button>
                )}
                {req.status === 'OPTIMISER_DONE' && (
                  <>
                    <button className="coa-action-btn coa-action-btn--approve" onClick={() => finalise(req.id)}>
                      ✅ Approve & Allocate Block
                    </button>
                    <button
                      className="coa-action-btn coa-action-btn--edit"
                      onClick={() => onNavigate('coa-schedule')}
                    >
                      ✏️ Edit Window First
                    </button>
                  </>
                )}
                {req.status === 'FINALISED' && (
                  <button
                    className="coa-action-btn coa-action-btn--view"
                    onClick={() => onNavigate('coa-schedule')}
                  >
                    View in Final Schedule →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
