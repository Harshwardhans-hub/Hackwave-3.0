import React, { useState } from 'react';
import './COADashboardPage.css';

// Shared mock data — single source of truth for COA pages
export const MOCK_REQUESTS = [
  {
    id: 'REQ-001',
    dept: 'P-Way',
    deptClass: 'pway',
    section: 'NDLS–AGC KM 127.40–128.80',
    activity: 'CSM-92 Mechanised Track Tamping',
    duration: '3.0h',
    urgency: 'Critical',
    regulation: 'IRPWM Para 808',
    submittedAt: '10-Sep-2026 22:14 IST',
    status: 'FINALISED',
    allocatedWindow: '00:30–04:00',
    privateNo: 'PN-884102-DLI',
  },
  {
    id: 'REQ-002',
    dept: 'S&T',
    deptClass: 'snt',
    section: 'NDLS–AGC KM 128.10 (Palwal Outer)',
    activity: 'Point Machine 104-A Overhaul & Testing',
    duration: '2.0h',
    urgency: 'High',
    regulation: 'IRSEM Section 3',
    submittedAt: '10-Sep-2026 22:31 IST',
    status: 'FINALISED',
    allocatedWindow: '00:30–04:00',
    privateNo: 'PN-884102-DLI',
  },
  {
    id: 'REQ-003',
    dept: 'TRD',
    deptClass: 'trd',
    section: 'NDLS–AGC KM 126.50–129.50',
    activity: '25kV Catenary Stagger Alignment & Wash',
    duration: '2.5h',
    urgency: 'Medium',
    regulation: 'ACTM Vol II Para 2063',
    submittedAt: '10-Sep-2026 22:47 IST',
    status: 'FINALISED',
    allocatedWindow: '00:30–04:00',
    privateNo: 'PN-884102-DLI',
  },
  {
    id: 'REQ-004',
    dept: 'P-Way',
    deptClass: 'pway',
    section: 'GZB–ALJN KM 64.20–68.00',
    activity: 'USFD Ultrasonic Rail Flaw Testing',
    duration: '2.5h',
    urgency: 'Critical',
    regulation: 'USFD Manual 2022',
    submittedAt: '11-Sep-2026 08:05 IST',
    status: 'OPTIMISER_DONE',
    allocatedWindow: '09:00–11:30',
    privateNo: null,
  },
  {
    id: 'REQ-005',
    dept: 'S&T',
    deptClass: 'snt',
    section: 'CNB–LKO KM 38.50',
    activity: 'Axle Counter Track Sensor Replacement',
    duration: '1.5h',
    urgency: 'Medium',
    regulation: 'SEM Para 14.3',
    submittedAt: '11-Sep-2026 09:12 IST',
    status: 'AI_PROCESSING',
    allocatedWindow: null,
    privateNo: null,
  },
  {
    id: 'REQ-006',
    dept: 'TRD',
    deptClass: 'trd',
    section: 'NDLS–AGC KM 110.00–114.50',
    activity: 'OHE 25kV Wire Dropper & Stagger Tuning',
    duration: '3.5h',
    urgency: 'High',
    regulation: 'ACTM Vol II Para 2063',
    submittedAt: '11-Sep-2026 10:44 IST',
    status: 'INCOMING',
    allocatedWindow: null,
    privateNo: null,
  },
  {
    id: 'REQ-007',
    dept: 'P-Way',
    deptClass: 'pway',
    section: 'Palwal Yard KM 60.0–62.0',
    activity: 'Deep Ballast Cleaning (BCM #14)',
    duration: '3.5h',
    urgency: 'High',
    regulation: 'IRPWM Para 808',
    submittedAt: '11-Sep-2026 11:20 IST',
    status: 'INCOMING',
    allocatedWindow: null,
    privateNo: null,
  },
];

export const FINALISED_SCHEDULE = [
  {
    blockId: 'BLK-S01',
    type: 'bundle',
    title: 'Shadow Block #104: Tamping + Point M/C + OHE',
    section: 'NDLS–AGC KM 126.50–129.20 (UP Main)',
    window: '00:30–04:00 (3.5h)',
    dept: 'MULTI (P-Way + S&T + TRD)',
    requests: ['REQ-001', 'REQ-002', 'REQ-003'],
    privateNo: 'PN-884102-DLI',
    tsr: '30 km/h Caution Order',
    status: 'APPROVED',
  },
  {
    blockId: 'BLK-S02',
    type: 'pway',
    title: 'USFD Ultrasonic Rail Flaw Scan',
    section: 'GZB–ALJN KM 84.10–92.50',
    window: '09:00–11:30 (2.5h)',
    dept: 'P-Way (USFD)',
    requests: ['REQ-004'],
    privateNo: 'PN-741982-AGC',
    tsr: 'Trolley on track',
    status: 'PENDING_APPROVAL',
  },
];

const STATUS_META = {
  INCOMING:        { label: 'Incoming',          color: '#64748B', bg: 'rgba(100,116,139,0.15)' },
  AI_PROCESSING:   { label: 'AI Segregation',     color: '#F59E0B', bg: 'rgba(245,158,11,0.15)'  },
  OPTIMISER_DONE:  { label: 'Optimiser Report',   color: '#3B82F6', bg: 'rgba(59,130,246,0.15)'  },
  FINALISED:       { label: 'Finalised',          color: '#10B981', bg: 'rgba(16,185,129,0.15)'  },
};

const DEPT_COLOR = { pway: '#10B981', snt: '#F59E0B', trd: '#8B5CF6' };

export default function COADashboardPage({ onNavigate, currentUser }) {
  const incoming  = MOCK_REQUESTS.filter(r => r.status === 'INCOMING');
  const inProcess = MOCK_REQUESTS.filter(r => r.status === 'AI_PROCESSING' || r.status === 'OPTIMISER_DONE');
  const finalised = MOCK_REQUESTS.filter(r => r.status === 'FINALISED');

  const approvedBlocks  = FINALISED_SCHEDULE.filter(b => b.status === 'APPROVED');
  const pendingBlocks   = FINALISED_SCHEDULE.filter(b => b.status === 'PENDING_APPROVAL');

  return (
    <div className="coa-dash">
      {/* ── Page Header ─────────────────────────────────── */}
      <header className="coa-dash__header">
        <div className="coa-dash__header-left">
          <div className="coa-badge">
            <span className="coa-badge__dot"></span>
            COA • CONTROL OFFICE APPLICATION • NORTHERN RAILWAY / DELHI DIV
          </div>
          <h1 className="coa-dash__title">
            Section Controller <span>Command Centre</span>
          </h1>
          <p className="coa-dash__meta">
            Welcome, {currentUser?.name} — {currentUser?.role} &nbsp;|&nbsp; Sahayak Rail · SIH 26027
          </p>
        </div>

        <div className="coa-dash__header-actions">
          <button className="coa-btn-outline" onClick={() => onNavigate('coa-requests')}>
            Manage All Requests →
          </button>
          <button className="coa-btn-primary" onClick={() => onNavigate('coa-schedule')}>
            View / Edit Final Schedule →
          </button>
        </div>
      </header>

      {/* ── KPI Strip ───────────────────────────────────── */}
      <section className="coa-kpi-row">
        <div className="coa-kpi">
          <span className="coa-kpi__num" style={{ color: '#64748B' }}>{incoming.length}</span>
          <span className="coa-kpi__label">Incoming Requests</span>
        </div>
        <div className="coa-kpi">
          <span className="coa-kpi__num" style={{ color: '#F59E0B' }}>{inProcess.length}</span>
          <span className="coa-kpi__label">In Pipeline</span>
        </div>
        <div className="coa-kpi">
          <span className="coa-kpi__num" style={{ color: '#10B981' }}>{finalised.length}</span>
          <span className="coa-kpi__label">Finalised Requests</span>
        </div>
        <div className="coa-kpi">
          <span className="coa-kpi__num" style={{ color: '#3B82F6' }}>{approvedBlocks.length}</span>
          <span className="coa-kpi__label">Approved Blocks Today</span>
        </div>
        <div className="coa-kpi">
          <span className="coa-kpi__num" style={{ color: '#EF4444' }}>{pendingBlocks.length}</span>
          <span className="coa-kpi__label">Pending Your Approval</span>
        </div>
      </section>

      {/* ── Two-column body ─────────────────────────────── */}
      <div className="coa-dash__body">

        {/* Left: Latest Requests ──────────────────────── */}
        <section className="coa-dash__panel">
          <div className="coa-panel__head">
            <h2 className="coa-panel__title">Latest Maintenance Requests</h2>
            <button className="coa-panel__link" onClick={() => onNavigate('coa-requests')}>
              View all →
            </button>
          </div>

          <div className="coa-req-list">
            {MOCK_REQUESTS.slice(0, 5).map(req => {
              const sm = STATUS_META[req.status];
              return (
                <div key={req.id} className="coa-req-row">
                  <div className="coa-req-row__left">
                    <span
                      className="coa-req-dept"
                      style={{ background: `${DEPT_COLOR[req.deptClass]}22`, color: DEPT_COLOR[req.deptClass] }}
                    >
                      {req.dept}
                    </span>
                    <div>
                      <div className="coa-req-title">{req.activity}</div>
                      <div className="coa-req-meta">{req.section} &nbsp;·&nbsp; {req.duration}</div>
                    </div>
                  </div>
                  <span
                    className="coa-req-status"
                    style={{ background: sm.bg, color: sm.color }}
                  >
                    {sm.label}
                  </span>
                </div>
              );
            })}
          </div>

          <button
            className="coa-panel__cta"
            onClick={() => onNavigate('coa-requests')}
          >
            Process Incoming Requests →
          </button>
        </section>

        {/* Right: Final Schedule Snapshot ────────────── */}
        <section className="coa-dash__panel">
          <div className="coa-panel__head">
            <h2 className="coa-panel__title">Today's Finalised Schedule</h2>
            <button className="coa-panel__link" onClick={() => onNavigate('coa-schedule')}>
              Edit schedule →
            </button>
          </div>

          {FINALISED_SCHEDULE.length === 0 ? (
            <div className="coa-empty">No blocks finalised yet for today.</div>
          ) : (
            <div className="coa-sched-list">
              {FINALISED_SCHEDULE.map(blk => (
                <div key={blk.blockId} className={`coa-sched-card coa-sched-card--${blk.type}`}>
                  <div className="coa-sched-card__top">
                    <div>
                      <span className={`coa-sched-type coa-sched-type--${blk.type}`}>
                        {blk.type === 'bundle' ? '⭐ Shadow Bundle' : blk.dept}
                      </span>
                      <div className="coa-sched-title">{blk.title}</div>
                    </div>
                    <span
                      className="coa-sched-status"
                      style={{
                        color: blk.status === 'APPROVED' ? '#10B981' : '#F59E0B',
                        background: blk.status === 'APPROVED' ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                      }}
                    >
                      {blk.status === 'APPROVED' ? '✓ Approved' : '⏳ Pending Approval'}
                    </span>
                  </div>

                  <div className="coa-sched-meta">
                    <span>🕐 {blk.window}</span>
                    <span>📍 {blk.section}</span>
                  </div>

                  {blk.privateNo && (
                    <div className="coa-sched-pn">PN: <strong className="font-mono">{blk.privateNo}</strong></div>
                  )}

                  <div className="coa-sched-actions">
                    <button
                      className="coa-sched-btn coa-sched-btn--view"
                      onClick={() => onNavigate('coa-schedule')}
                    >
                      View / Edit
                    </button>
                    {blk.status === 'PENDING_APPROVAL' && (
                      <button
                        className="coa-sched-btn coa-sched-btn--approve"
                        onClick={() => onNavigate('coa-schedule')}
                      >
                        Approve Block →
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ── Quick Navigation ────────────────────────────── */}
      <section className="coa-quick-nav">
        <h3 className="coa-quick-nav__title">Quick Access</h3>
        <div className="coa-quick-nav__grid">
          {[
            { icon: '📋', label: 'All Requests & Pipeline', sub: 'View, process and track requests', route: 'coa-requests' },
            { icon: '📅', label: 'Edit & Approve Schedule', sub: 'Edit blocks and issue approvals', route: 'coa-schedule' },
            { icon: '🌦️', label: 'Weather Radar', sub: 'IMD monsoon & risk adaptation', route: 'weather' },
            { icon: '📦', label: 'Freight Forecast', sub: 'Goods train calm windows', route: 'freight' },
            { icon: '📡', label: 'Field Dispatch', sub: 'SMS terminal & Form T/348M', route: 'field-dispatch' },
            { icon: '🔍', label: 'Audit & XAI Trail', sub: 'Regulatory compliance ledger', route: 'audit' },
          ].map(item => (
            <button
              key={item.route}
              className="coa-nav-tile"
              onClick={() => onNavigate(item.route)}
            >
              <span className="coa-nav-tile__icon">{item.icon}</span>
              <div>
                <div className="coa-nav-tile__label">{item.label}</div>
                <div className="coa-nav-tile__sub">{item.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
