import React from 'react';
import { MOCK_REQUESTS, FINALISED_SCHEDULE } from './COADashboardPage';
import './DeptDashboardPage.css';

/* ── dept meta ─────────────────────────────────────── */
export const DEPT_META = {
  PWAY: {
    label: 'Permanent Way (P-Way)',
    short: 'P-Way',
    icon: '🛤️',
    color: '#059669',
    colorLight: '#ecfdf5',
    colorBorder: 'rgba(5,150,105,0.2)',
    accentClass: 'dept-pway',
    regulation: 'IRPWM Para 808',
    systemFeed: 'TMS (Track Management System)',
    deptKey: 'P-Way',
  },
  SNT: {
    label: 'Signal & Telecom (S&T)',
    short: 'S&T',
    icon: '🚦',
    color: '#b45309',
    colorLight: '#fffbeb',
    colorBorder: 'rgba(180,83,9,0.2)',
    accentClass: 'dept-snt',
    regulation: 'IRSEM Section 3',
    systemFeed: 'SMMS (Signal Maint. Mgmt System)',
    deptKey: 'S&T',
  },
  TRD: {
    label: 'Traction Distribution (TRD / OHE)',
    short: 'TRD',
    icon: '⚡',
    color: '#7c3aed',
    colorLight: '#f5f3ff',
    colorBorder: 'rgba(124,58,237,0.2)',
    accentClass: 'dept-trd',
    regulation: 'ACTM Vol II Para 2063',
    systemFeed: 'TDMS (Traction Distribution System)',
    deptKey: 'TRD',
  },
};

/* ── helpers ───────────────────────────────────────── */
const STATUS_META = {
  INCOMING:        { label: 'Incoming',         color: '#64748b', bg: '#f1f5f9' },
  AI_PROCESSING:   { label: 'AI Segregation',   color: '#b45309', bg: '#fffbeb' },
  OPTIMISER_DONE:  { label: 'Optimiser Done',   color: '#005494', bg: '#eef5fc' },
  FINALISED:       { label: 'Finalised / Allocated', color: '#059669', bg: '#ecfdf5' },
};

export default function DeptDashboardPage({ onNavigate, currentUser }) {
  const meta = DEPT_META[currentUser?.authType] || DEPT_META.PWAY;

  /* own requests = those matching this dept */
  const ownRequests = MOCK_REQUESTS.filter(r => r.deptClass === meta.accentClass.replace('dept-', ''));
  const pending     = ownRequests.filter(r => r.status !== 'FINALISED');
  const allocated   = ownRequests.filter(r => r.status === 'FINALISED');

  /* final schedule blocks relevant to this dept */
  const myBlocks = FINALISED_SCHEDULE.filter(b =>
    b.type === 'bundle' || b.dept.toLowerCase().includes(meta.short.toLowerCase())
  );

  return (
    <div className="dept-dash">
      {/* ── Header ─────────────────────────────────── */}
      <header className="dept-dash__header">
        <div className="dept-dash__header-left">
          <div
            className="dept-badge"
            style={{ color: meta.color, background: meta.colorLight, borderColor: meta.colorBorder }}
          >
            <span
              className="dept-badge__dot"
              style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }}
            />
            {meta.icon} {meta.label.toUpperCase()} · NORTHERN RAILWAY / DELHI DIV
          </div>
          <h1 className="dept-dash__title">
            {meta.icon} {meta.short} <span style={{ color: meta.color }}>Department Portal</span>
          </h1>
          <p className="dept-dash__meta">
            Welcome, <strong>{currentUser?.name}</strong> — {currentUser?.role}
            &nbsp;|&nbsp; {currentUser?.division}
          </p>
        </div>
        <div className="dept-dash__header-actions">
          <button
            className="dept-btn-outline"
            onClick={() => onNavigate('dept-dispatch')}
          >
            🚨 Emergency / SMS Dispatch
          </button>
          <button
            className="dept-btn-primary"
            style={{ background: meta.color }}
            onClick={() => onNavigate('dept-requests')}
          >
            + Submit Block Request
          </button>
        </div>
      </header>

      {/* ── KPI Strip ──────────────────────────────── */}
      <section className="dept-kpi-row">
        {[
          { num: ownRequests.length, label: 'Total Requests Submitted', color: meta.color },
          { num: pending.length,     label: 'Pending / In Pipeline',    color: '#b45309' },
          { num: allocated.length,   label: 'Blocks Allocated',         color: '#059669' },
          { num: myBlocks.filter(b => b.status === 'APPROVED').length, label: 'Approved in Schedule', color: '#005494' },
        ].map((k, i) => (
          <div className="dept-kpi" key={i}>
            <span className="dept-kpi__num" style={{ color: k.color }}>{k.num}</span>
            <span className="dept-kpi__label">{k.label}</span>
          </div>
        ))}
      </section>

      {/* ── Two-column body ────────────────────────── */}
      <div className="dept-dash__body">

        {/* Left — Own Requests ─────────────────────── */}
        <section className="dept-panel">
          <div className="dept-panel__head">
            <h2 className="dept-panel__title">My Block Requests</h2>
            <button className="dept-panel__link" onClick={() => onNavigate('dept-requests')}>
              View all & submit →
            </button>
          </div>

          {ownRequests.length === 0 ? (
            <p className="dept-empty">No requests submitted yet.</p>
          ) : (
            <div className="dept-req-list">
              {ownRequests.slice(0, 5).map(req => {
                const sm = STATUS_META[req.status];
                return (
                  <div className="dept-req-row" key={req.id}>
                    <div className="dept-req-row__left">
                      <span className="dept-req-id">{req.id}</span>
                      <div>
                        <div className="dept-req-title">{req.activity}</div>
                        <div className="dept-req-meta">{req.section} · {req.duration}</div>
                      </div>
                    </div>
                    <span
                      className="dept-req-status"
                      style={{ color: sm.color, background: sm.bg }}
                    >
                      {sm.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          <button className="dept-panel__cta" onClick={() => onNavigate('dept-requests')}>
            Submit New Block Request →
          </button>
        </section>

        {/* Right — Final Schedule snapshot ──────────── */}
        <section className="dept-panel">
          <div className="dept-panel__head">
            <h2 className="dept-panel__title">COA Final Schedule (My Blocks)</h2>
            <button className="dept-panel__link" onClick={() => onNavigate('dept-schedule')}>
              Full schedule →
            </button>
          </div>

          {myBlocks.length === 0 ? (
            <p className="dept-empty">No blocks in the final schedule yet.</p>
          ) : (
            <div className="dept-sched-list">
              {myBlocks.slice(0, 3).map(blk => (
                <div
                  key={blk.blockId}
                  className="dept-sched-card"
                  style={{ borderLeftColor: blk.type === 'bundle' ? '#f59e0b' : meta.color }}
                >
                  <div className="dept-sched-card__top">
                    <div>
                      <span
                        className="dept-sched-type"
                        style={{ color: blk.type === 'bundle' ? '#d97706' : meta.color }}
                      >
                        {blk.type === 'bundle' ? '⭐ Shadow Bundle' : meta.short}
                      </span>
                      <div className="dept-sched-title">{blk.title}</div>
                    </div>
                    <span
                      className="dept-sched-status"
                      style={{
                        color:      blk.status === 'APPROVED' ? '#059669' : '#b45309',
                        background: blk.status === 'APPROVED' ? '#ecfdf5' : '#fffbeb',
                      }}
                    >
                      {blk.status === 'APPROVED' ? '✓ Approved' : '⏳ Pending'}
                    </span>
                  </div>
                  <div className="dept-sched-meta">
                    <span>🕐 {blk.window}</span>
                    <span>📍 {blk.section}</span>
                  </div>
                  {blk.privateNo && (
                    <div className="dept-sched-pn">
                      🔑 PN: <strong className="font-mono">{blk.privateNo}</strong>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <button className="dept-panel__cta" onClick={() => onNavigate('dept-schedule')}>
            View Full COA Schedule →
          </button>
        </section>
      </div>

      {/* ── Quick Nav ──────────────────────────────── */}
      <section className="dept-quick-nav">
        <h3 className="dept-quick-nav__title">Quick Access</h3>
        <div className="dept-quick-nav__grid">
          {[
            { icon: '📋', label: 'My Block Requests',          sub: 'Submit & track your requests',          route: 'dept-requests'  },
            { icon: '📅', label: 'COA Final Schedule',         sub: 'View approved block schedule',          route: 'dept-schedule'  },
            { icon: '📨', label: 'Other Dept Requests',        sub: 'View & contact other departments',      route: 'dept-contact'   },
            { icon: '📡', label: 'SMS / Emergency Dispatch',   sub: 'Send SMS or report an emergency',       route: 'dept-dispatch'  },
          ].map(item => (
            <button
              key={item.route}
              className="dept-nav-tile"
              style={{ '--tile-color': meta.color }}
              onClick={() => onNavigate(item.route)}
            >
              <span className="dept-nav-tile__icon">{item.icon}</span>
              <div>
                <div className="dept-nav-tile__label">{item.label}</div>
                <div className="dept-nav-tile__sub">{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
