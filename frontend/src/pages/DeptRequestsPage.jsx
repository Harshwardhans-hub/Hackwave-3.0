import React, { useState } from 'react';
import { MOCK_REQUESTS } from './COADashboardPage';
import { DEPT_META } from './DeptDashboardPage';
import './DeptRequestsPage.css';

const STATUS_META = {
  INCOMING:        { label: '📥 Incoming',              color: '#64748b', bg: '#f1f5f9', step: 0 },
  AI_PROCESSING:   { label: '🤖 AI Segregation',        color: '#b45309', bg: '#fffbeb', step: 1 },
  OPTIMISER_DONE:  { label: '⚙️ Optimiser Done',         color: '#005494', bg: '#eef5fc', step: 2 },
  FINALISED:       { label: '✅ Allocated',              color: '#059669', bg: '#ecfdf5', step: 3 },
};

const URGENCY_OPTIONS = ['Critical', 'High', 'Medium', 'Routine'];

const ACTIVITY_SUGGESTIONS = {
  PWAY: ['CSM-92 Mechanised Track Tamping', 'USFD Ultrasonic Rail Flaw Testing', 'Deep Ballast Cleaning (BCM)', 'Rail Renewal (LWR)', 'Track Geometry Correction'],
  SNT:  ['Point Machine Overhaul & Testing', 'Axle Counter Sensor Replacement', 'Track Circuit Glued Joint Renewal', 'Cable Meggering & Jointing', 'Signal Lamp Renewal'],
  TRD:  ['25kV Catenary Stagger Alignment', 'OHE Wire Dropper & Stagger Tuning', 'Traction Substation Overhaul', 'Insulator Cleaning & Renewal', 'Power Block Isolation Test'],
};

const REGULATION_MAP = {
  PWAY: ['IRPWM Para 808', 'USFD Manual 2022', 'IRPWM Para 601', 'IRPWM Para 401'],
  SNT:  ['IRSEM Section 3', 'SEM Para 14.3', 'IRSEM Para 6.2', 'G&SR Rule 104'],
  TRD:  ['ACTM Vol II Para 2063', 'ACTM Vol I Para 1104', 'CEE Circular 2024', 'RDSO/TI/SPC/OHE'],
};

let nextId = 8; // continues from MOCK_REQUESTS

export default function DeptRequestsPage({ onNavigate, currentUser }) {
  const meta = DEPT_META[currentUser?.authType] || DEPT_META.PWAY;
  const authKey = currentUser?.authType || 'PWAY';

  const [requests, setRequests] = useState(
    MOCK_REQUESTS.filter(r => r.deptClass === authKey.toLowerCase())
  );
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    section: '',
    kmFrom: '',
    kmTo: '',
    activity: ACTIVITY_SUGGESTIONS[authKey]?.[0] || '',
    duration: '2.0',
    urgency: 'High',
    regulation: REGULATION_MAP[authKey]?.[0] || '',
    notes: '',
  });

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    const newReq = {
      id: `REQ-00${nextId++}`,
      dept: meta.short,
      deptClass: authKey.toLowerCase(),
      section: `${form.section} (KM ${form.kmFrom}–${form.kmTo})`,
      activity: form.activity,
      duration: `${form.duration}h`,
      urgency: form.urgency,
      regulation: form.regulation,
      submittedAt: new Date().toLocaleString('en-IN', { hour12: false }) + ' IST',
      status: 'INCOMING',
      allocatedWindow: null,
      privateNo: null,
      notes: form.notes,
    };
    setRequests(prev => [newReq, ...prev]);
    setSubmitted(true);
    setShowForm(false);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ section: '', kmFrom: '', kmTo: '', activity: ACTIVITY_SUGGESTIONS[authKey]?.[0] || '', duration: '2.0', urgency: 'High', regulation: REGULATION_MAP[authKey]?.[0] || '', notes: '' });
  };

  const STEPS = ['Incoming', 'AI Segregation', 'Optimiser', 'Allocated'];

  return (
    <div className="dept-req-page">
      {/* ── Header ─────────────────────────────────── */}
      <header className="dept-req-page__header">
        <div>
          <div
            className="dept-badge"
            style={{ color: meta.color, background: meta.colorLight, borderColor: meta.colorBorder }}
          >
            <span className="dept-badge__dot" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
            {meta.icon} {meta.short} · BLOCK REQUEST MANAGEMENT
          </div>
          <h1 className="dept-req-page__title">
            Block Requests <span style={{ color: meta.color }}>&amp; Pipeline</span>
          </h1>
          <p className="dept-req-page__meta">
            Submit new maintenance block requests and track their progress through COA's approval pipeline.
          </p>
        </div>
        <div className="dept-req-page__actions">
          <button className="dept-btn-outline" onClick={() => onNavigate('dept-dashboard')}>
            ← Dashboard
          </button>
          <button
            className="dept-btn-primary"
            style={{ background: meta.color }}
            onClick={() => setShowForm(v => !v)}
          >
            {showForm ? '✕ Cancel' : '+ New Block Request'}
          </button>
        </div>
      </header>

      {/* ── Success banner ──────────────────────────── */}
      {submitted && (
        <div className="dept-success-banner" style={{ borderColor: meta.colorBorder, color: meta.color, background: meta.colorLight }}>
          ✅ Request submitted successfully! It has been sent to COA for processing.
        </div>
      )}

      {/* ── Submission Form ─────────────────────────── */}
      {showForm && (
        <section className="dept-form-card">
          <div className="dept-form-card__header" style={{ borderBottomColor: meta.colorBorder }}>
            <h2 className="dept-form-card__title" style={{ color: meta.color }}>
              {meta.icon} New Maintenance Block Request
            </h2>
            <p className="dept-form-card__sub">
              Fill in the details below. Your request will go to COA's queue immediately.
            </p>
          </div>

          <form className="dept-form" onSubmit={handleSubmit}>
            <div className="dept-form__row">
              <div className="dept-form__field">
                <label>Section / Corridor</label>
                <input
                  name="section" value={form.section} onChange={handleChange}
                  placeholder="e.g. NDLS–AGC" required
                  className="dept-input"
                />
              </div>
              <div className="dept-form__field" style={{ maxWidth: 130 }}>
                <label>KM From</label>
                <input
                  name="kmFrom" value={form.kmFrom} onChange={handleChange}
                  placeholder="e.g. 127.40" required className="dept-input"
                />
              </div>
              <div className="dept-form__field" style={{ maxWidth: 130 }}>
                <label>KM To</label>
                <input
                  name="kmTo" value={form.kmTo} onChange={handleChange}
                  placeholder="e.g. 128.80" required className="dept-input"
                />
              </div>
            </div>

            <div className="dept-form__row">
              <div className="dept-form__field dept-form__field--grow">
                <label>Maintenance Activity</label>
                <input
                  name="activity" value={form.activity} onChange={handleChange}
                  list={`activity-list-${authKey}`}
                  placeholder="Describe the activity" required className="dept-input"
                />
                <datalist id={`activity-list-${authKey}`}>
                  {(ACTIVITY_SUGGESTIONS[authKey] || []).map(a => (
                    <option key={a} value={a} />
                  ))}
                </datalist>
              </div>
              <div className="dept-form__field" style={{ maxWidth: 130 }}>
                <label>Duration (hours)</label>
                <input
                  name="duration" type="number" step="0.5" min="0.5" max="8"
                  value={form.duration} onChange={handleChange}
                  required className="dept-input"
                />
              </div>
            </div>

            <div className="dept-form__row">
              <div className="dept-form__field">
                <label>Urgency Level</label>
                <select name="urgency" value={form.urgency} onChange={handleChange} className="dept-input">
                  {URGENCY_OPTIONS.map(u => <option key={u}>{u}</option>)}
                </select>
              </div>
              <div className="dept-form__field">
                <label>Governing Regulation</label>
                <select name="regulation" value={form.regulation} onChange={handleChange} className="dept-input">
                  {(REGULATION_MAP[authKey] || []).map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="dept-form__field">
              <label>Additional Notes (optional)</label>
              <textarea
                name="notes" value={form.notes} onChange={handleChange}
                rows={2} className="dept-input dept-textarea"
                placeholder="Machine availability, crew details, special constraints..."
              />
            </div>

            <div className="dept-form__footer">
              <button
                type="submit"
                className="dept-btn-primary dept-btn-submit"
                style={{ background: meta.color }}
              >
                Submit to COA Pipeline →
              </button>
            </div>
          </form>
        </section>
      )}

      {/* ── Pipeline progress bar ───────────────────── */}
      <div className="dept-pipeline-bar">
        {STEPS.map((step, i) => {
          const count = requests.filter(r => STATUS_META[r.status]?.step === i).length;
          return (
            <React.Fragment key={step}>
              <div className={`dept-pipe-step ${count > 0 ? 'active' : ''}`} style={{ '--step-color': meta.color }}>
                <span className="dept-pipe-step__num" style={count > 0 ? { background: meta.color, color: '#fff' } : {}}>{count}</span>
                <span className="dept-pipe-step__label">{step}</span>
              </div>
              {i < STEPS.length - 1 && <div className="dept-pipe-arrow">→</div>}
            </React.Fragment>
          );
        })}
      </div>

      {/* ── Request list ────────────────────────────── */}
      <div className="dept-req-cards">
        {requests.length === 0 && (
          <div className="dept-empty">
            You haven't submitted any block requests yet.
            <button className="dept-empty-cta" style={{ color: meta.color }} onClick={() => setShowForm(true)}>
              Submit your first request →
            </button>
          </div>
        )}

        {requests.map(req => {
          const sm = STATUS_META[req.status];
          return (
            <div
              key={req.id}
              className="dept-req-card"
              style={{ borderLeftColor: sm.color }}
            >
              <div className="dept-req-card__top">
                <div className="dept-req-card__ids">
                  <span className="dept-req-card__id font-mono">{req.id}</span>
                  <span
                    className="dept-req-card__urgency"
                    style={{
                      color: req.urgency === 'Critical' ? '#b91c1c' : req.urgency === 'High' ? '#b45309' : '#64748b',
                    }}
                  >
                    ● {req.urgency}
                  </span>
                </div>
                <span className="dept-req-card__status" style={{ color: sm.color, background: sm.bg }}>
                  {sm.label}
                </span>
              </div>

              <div className="dept-req-card__activity">{req.activity}</div>

              <div className="dept-req-card__details">
                <span>📍 {req.section}</span>
                <span>⏱ {req.duration}</span>
                <span>📋 {req.regulation}</span>
                <span>🕐 Submitted: {req.submittedAt}</span>
              </div>

              {/* Pipeline progress mini-bar */}
              <div className="dept-progress-bar">
                {STEPS.map((step, i) => (
                  <div
                    key={step}
                    className={`dept-progress-step ${i <= (sm?.step ?? 0) ? 'done' : ''}`}
                    style={i <= (sm?.step ?? 0) ? { background: meta.color, borderColor: meta.color } : {}}
                  >
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {req.status === 'FINALISED' && (
                <div className="dept-req-allocated" style={{ borderColor: meta.colorBorder, background: meta.colorLight }}>
                  <span>✅ Block Allocated</span>
                  {req.allocatedWindow && <span>🕐 Window: <strong>{req.allocatedWindow}</strong></span>}
                  {req.privateNo      && <span>🔑 PN: <strong className="font-mono">{req.privateNo}</strong></span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
