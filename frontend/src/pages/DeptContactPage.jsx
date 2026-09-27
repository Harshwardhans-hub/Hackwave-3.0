import React, { useState } from 'react';
import { MOCK_REQUESTS } from './COADashboardPage';
import { DEPT_META } from './DeptDashboardPage';
import './DeptContactPage.css';

const DEPT_COLOR = {
  pway: { color: '#059669', bg: '#ecfdf5', label: 'P-Way' },
  snt:  { color: '#b45309', bg: '#fffbeb', label: 'S&T'   },
  trd:  { color: '#7c3aed', bg: '#f5f3ff', label: 'TRD'   },
};

const URGENCY_COLOR = {
  Critical: '#b91c1c',
  High:     '#b45309',
  Medium:   '#005494',
  Routine:  '#64748b',
};

const STATUS_META = {
  INCOMING:        { label: 'Incoming',         color: '#64748b', bg: '#f1f5f9' },
  AI_PROCESSING:   { label: 'AI Segregation',   color: '#b45309', bg: '#fffbeb' },
  OPTIMISER_DONE:  { label: 'Optimiser Done',   color: '#005494', bg: '#eef5fc' },
  FINALISED:       { label: 'Finalised',        color: '#059669', bg: '#ecfdf5' },
};

export default function DeptContactPage({ onNavigate, currentUser }) {
  const meta    = DEPT_META[currentUser?.authType] || DEPT_META.PWAY;
  const authKey = (currentUser?.authType || 'PWAY').toLowerCase();

  /* show all OTHER departments' requests */
  const otherRequests = MOCK_REQUESTS.filter(r => r.deptClass !== authKey);

  const [filterDept, setFilterDept]   = useState('ALL');
  const [openContact, setOpenContact] = useState(null); // req object
  const [msgText, setMsgText]         = useState('');
  const [sentIds,  setSentIds]        = useState([]);
  const [expandedId, setExpandedId]   = useState(null);

  /* pre-fill contact form when opening */
  const handleOpenContact = (req) => {
    setOpenContact(req);
    setMsgText(
      `Hi ${DEPT_COLOR[req.deptClass]?.label || req.dept} Team,\n\n` +
      `Regarding your block request ${req.id} — "${req.activity}" at ${req.section}:\n\n`
    );
  };

  const handleSend = () => {
    if (!msgText.trim() || !openContact) return;
    setSentIds(prev => [...prev, openContact.id]);
    setOpenContact(null);
    setMsgText('');
  };

  const visible = filterDept === 'ALL'
    ? otherRequests
    : otherRequests.filter(r => r.deptClass === filterDept);

  const deptCounts = {
    pway: otherRequests.filter(r => r.deptClass === 'pway').length,
    snt:  otherRequests.filter(r => r.deptClass === 'snt').length,
    trd:  otherRequests.filter(r => r.deptClass === 'trd').length,
  };

  return (
    <div className="dept-contact-page">
      {/* ── Header ─────────────────────────────────── */}
      <header className="dept-contact-page__header">
        <div>
          <div
            className="dept-badge"
            style={{ color: meta.color, background: meta.colorLight, borderColor: meta.colorBorder }}
          >
            <span className="dept-badge__dot" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
            {meta.icon} {meta.short} · INTER-DEPARTMENT COORDINATION
          </div>
          <h1 className="dept-contact-page__title">
            Other Department <span style={{ color: meta.color }}>Requests</span>
          </h1>
          <p className="dept-contact-page__meta">
            View pending maintenance requests from other departments. If a request affects your section
            or schedule, you can contact that department directly.
          </p>
        </div>
        <div className="dept-contact-page__actions">
          <button className="dept-btn-outline" onClick={() => onNavigate('dept-dashboard')}>
            ← Dashboard
          </button>
        </div>
      </header>

      {/* ── Filter tabs ─────────────────────────────── */}
      <div className="dept-contact-tabs">
        {[
          { key: 'ALL',  label: `All Departments (${otherRequests.length})` },
          { key: 'pway', label: `P-Way (${deptCounts.pway})` },
          { key: 'snt',  label: `S&T (${deptCounts.snt})` },
          { key: 'trd',  label: `TRD (${deptCounts.trd})` },
        ].filter(t => {
          /* hide own dept tab */
          if (t.key === authKey) return false;
          return true;
        }).map(t => (
          <button
            key={t.key}
            className={`dept-contact-tab ${filterDept === t.key ? 'active' : ''}`}
            style={filterDept === t.key ? { '--tab-color': meta.color } : {}}
            onClick={() => setFilterDept(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Request cards ────────────────────────────── */}
      <div className="dept-contact-cards">
        {visible.length === 0 && (
          <p className="dept-empty">No requests from other departments.</p>
        )}

        {visible.map(req => {
          const dc   = DEPT_COLOR[req.deptClass] || DEPT_COLOR.pway;
          const sm   = STATUS_META[req.status];
          const sent = sentIds.includes(req.id);
          const open = expandedId === req.id;

          return (
            <div
              key={req.id}
              className="dept-contact-card"
              style={{ borderLeftColor: dc.color }}
            >
              {/* Top row */}
              <div className="dept-contact-card__top">
                <div className="dept-contact-card__left">
                  <span className="dept-contact-card__id font-mono">{req.id}</span>
                  <span
                    className="dept-contact-card__dept"
                    style={{ color: dc.color, background: dc.bg }}
                  >
                    {dc.label}
                  </span>
                  <span
                    className="dept-contact-card__urgency"
                    style={{ color: URGENCY_COLOR[req.urgency] }}
                  >
                    ● {req.urgency}
                  </span>
                </div>
                <span
                  className="dept-contact-card__status"
                  style={{ color: sm.color, background: sm.bg }}
                >
                  {sm.label}
                </span>
              </div>

              {/* Activity & details */}
              <div className="dept-contact-card__activity">{req.activity}</div>
              <div className="dept-contact-card__details">
                <span>📍 {req.section}</span>
                <span>⏱ {req.duration}</span>
                <span>📋 {req.regulation}</span>
              </div>

              {/* Expanded view */}
              {open && (
                <div className="dept-contact-card__expanded">
                  <div className="dept-contact-detail-row">
                    <span>Submitted</span><strong>{req.submittedAt}</strong>
                  </div>
                  {req.allocatedWindow && (
                    <div className="dept-contact-detail-row">
                      <span>Allocated Window</span><strong>{req.allocatedWindow}</strong>
                    </div>
                  )}
                  {req.privateNo && (
                    <div className="dept-contact-detail-row">
                      <span>Private No.</span><strong className="font-mono">{req.privateNo}</strong>
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="dept-contact-card__actions">
                <button
                  className="dept-contact-btn dept-contact-btn--view"
                  onClick={() => setExpandedId(open ? null : req.id)}
                >
                  {open ? 'Hide Details' : 'View Details'}
                </button>
                {sent ? (
                  <span className="dept-contact-sent">✓ Message Sent</span>
                ) : (
                  <button
                    className="dept-contact-btn dept-contact-btn--contact"
                    style={{ background: meta.colorLight, color: meta.color, borderColor: meta.colorBorder }}
                    onClick={() => handleOpenContact(req)}
                  >
                    📨 Contact {dc.label} Department
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Contact Modal ────────────────────────────── */}
      {openContact && (
        <div className="dept-contact-modal-overlay" onClick={() => setOpenContact(null)}>
          <div
            className="dept-contact-modal"
            onClick={e => e.stopPropagation()}
          >
            <div className="dept-contact-modal__header" style={{ borderBottomColor: meta.colorBorder }}>
              <div>
                <div className="dept-contact-modal__to">
                  To: <strong>{DEPT_COLOR[openContact.deptClass]?.label} Department</strong>
                </div>
                <div className="dept-contact-modal__subject">
                  Re: {openContact.id} — {openContact.activity}
                </div>
              </div>
              <button className="dept-contact-modal__close" onClick={() => setOpenContact(null)}>✕</button>
            </div>

            {/* Pre-filled context info (read-only) */}
            <div className="dept-contact-modal__context">
              <div className="dept-contact-ctx-row">
                <span>Request ID</span><strong className="font-mono">{openContact.id}</strong>
              </div>
              <div className="dept-contact-ctx-row">
                <span>Activity</span><strong>{openContact.activity}</strong>
              </div>
              <div className="dept-contact-ctx-row">
                <span>Section</span><strong>{openContact.section}</strong>
              </div>
              <div className="dept-contact-ctx-row">
                <span>Duration</span><strong>{openContact.duration}</strong>
              </div>
              <div className="dept-contact-ctx-row">
                <span>Status</span>
                <strong style={{ color: STATUS_META[openContact.status]?.color }}>
                  {STATUS_META[openContact.status]?.label}
                </strong>
              </div>
            </div>

            {/* Message body */}
            <div className="dept-contact-modal__body">
              <label className="dept-contact-modal__label">Message</label>
              <textarea
                className="dept-contact-modal__textarea"
                value={msgText}
                onChange={e => setMsgText(e.target.value)}
                rows={7}
                placeholder="Type your message..."
                style={{ '--focus-color': meta.color }}
              />
            </div>

            <div className="dept-contact-modal__footer">
              <span className="dept-contact-modal__from">
                From: {currentUser?.name} ({meta.short} Dept)
              </span>
              <div style={{ display: 'flex', gap: 10 }}>
                <button className="dept-btn-outline" onClick={() => setOpenContact(null)}>
                  Cancel
                </button>
                <button
                  className="dept-btn-primary"
                  style={{ background: meta.color }}
                  onClick={handleSend}
                  disabled={!msgText.trim()}
                >
                  📨 Send Message
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
