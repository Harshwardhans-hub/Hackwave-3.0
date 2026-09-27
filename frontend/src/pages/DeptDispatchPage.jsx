import React, { useState } from 'react';
import { DEPT_META } from './DeptDashboardPage';
import './DeptDispatchPage.css';

const SEED_THREAD = [
  {
    id: 1, sender: 'info',
    text: 'Sahayak Rail Field Dispatch Terminal. Use the quick buttons to send a standard block request. The system will acknowledge receipt and forward it to COA.',
    time: '-- system --',
  },
];

/* Dept sends a standard block-request template. System only acknowledges receipt.
   The actual approval / scheduling happens on the COA side.                      */
const QUICK_MSGS = {
  PWAY: [
    { label: '🛤️ Track Tamping Request',   text: 'BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DEPT:ENGG | TYPE:TRACK_TAMP | DUR:3HR' },
    { label: '🔍 USFD Flaw Test Request',  text: 'BLOCK REQ | SEC:NDL-GZB | KM:84-92   | DEPT:ENGG | TYPE:USFD_TEST  | DUR:2.5HR' },
    { label: '🪨 Ballast Cleaning Request', text: 'BLOCK REQ | SEC:NDL-AGC | KM:145-148 | DEPT:ENGG | TYPE:BCM_CLEAN  | DUR:3.5HR' },
  ],
  SNT: [
    { label: '🚦 Point Machine Request',   text: 'BLOCK REQ | SEC:NDL-GZB | KM:128     | DEPT:SNT  | TYPE:POINT_OVHL | DUR:2HR' },
    { label: '📡 Axle Counter Request',    text: 'BLOCK REQ | SEC:CNB-LKO | KM:38      | DEPT:SNT  | TYPE:AXLE_CNTR  | DUR:1.5HR' },
    { label: '🔌 Cable Meggering Request', text: 'BLOCK REQ | SEC:NDL-GZB | KM:60-62   | DEPT:SNT  | TYPE:CABLE_MEG  | DUR:2HR' },
  ],
  TRD: [
    { label: '⚡ OHE Stagger Request',     text: 'BLOCK REQ | SEC:NDL-GZB | KM:126-129 | DEPT:TRD  | TYPE:OHE_STAGGER | DUR:2.5HR' },
    { label: '🔧 Dropper Tuning Request',  text: 'BLOCK REQ | SEC:NDL-AGC | KM:110-114 | DEPT:TRD  | TYPE:OHE_DROPPER | DUR:3HR' },
    { label: '🏗️ Substation Test Request', text: 'BLOCK REQ | SEC:NDL-AGC | KM:50      | DEPT:TRD  | TYPE:SS_OVERHAUL | DUR:3.5HR' },
  ],
};

const INCIDENT_TYPES = [
  { value: 'RAIL_FRACTURE',    label: 'Rail Fracture / Break' },
  { value: 'TRACK_BUCKLE',     label: 'Track Buckle / Sun Kink' },
  { value: 'WASHOUT',          label: 'Track Washout / Flood' },
  { value: 'SIGNAL_FAIL',      label: 'Signal Failure (At Danger)' },
  { value: 'POINT_FAIL',       label: 'Point Machine Failure' },
  { value: 'AXLE_COUNT_FAIL',  label: 'Axle Counter Failure' },
  { value: 'OHE_SNAP',         label: 'OHE Wire Snap / Dewirement' },
  { value: 'POWER_FAIL',       label: 'Traction Power Failure' },
  { value: 'EARTH_FAULT',      label: 'Earth Fault on 25kV' },
  { value: 'DERAILMENT',       label: 'Derailment / Obstruction' },
  { value: 'OTHER',            label: 'Other Emergency' },
];

function parseReply(text) {
  const u = text.toUpperCase();
  if (u.includes('EMERGENCY') || u.includes('FRACTURE') || u.includes('FAIL') || u.includes('SNAP') || u.includes('WASHOUT')) {
    const km = u.match(/KM:(\d+(?:\.\d+)?)/)?.[1] || '?';
    const pn = `PN-EMRG-${Math.floor(100000 + Math.random() * 899999)}`;
    return `🚨 SAHAYAK RAIL SYSTEM: EMERGENCY RECEIVED. Location KM ${km}. Logged as EMERGENCY — Reference: ${pn}. Section Controller has been alerted. Await further instructions from COA control.`;
  }
  /* All other msgs (block requests) → simple receipt acknowledgement only */
  const sec   = u.match(/SEC:([A-Z\-]+)/)?.[1]?.replace('-', '–') || 'requested section';
  const dur   = u.match(/DUR:(\d+(?:\.\d+)?)HR/)?.[1] || '?';
  const km2   = u.match(/KM:([\d.\-]+)/)?.[1] || '?';
  const reqId = `REQ-SMS-${Math.floor(10000 + Math.random() * 89999)}`;
  return `✅ SAHAYAK RAIL SYSTEM: Block request received and logged. Request ID: ${reqId}. Section: ${sec}, KM: ${km2}, Duration: ${dur}h. Forwarded to COA for review and scheduling. No further action needed from your side.`;
}

let msgId = 2;

export default function DeptDispatchPage({ onNavigate, currentUser }) {
  const meta     = DEPT_META[currentUser?.authType] || DEPT_META.PWAY;
  const authKey  = currentUser?.authType || 'PWAY';
  const quickMsgs = QUICK_MSGS[authKey] || QUICK_MSGS.PWAY;

  const [thread,  setThread]  = useState(SEED_THREAD);
  const [input,   setInput]   = useState('');
  const [tab,     setTab]     = useState('sms'); // 'sms' | 'emergency'
  const [emgForm, setEmgForm] = useState({ section: '', km: '', type: 'RAIL_FRACTURE', details: '' });
  const [emgSent, setEmgSent] = useState(false);

  const now = () =>
    new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false }) + ' IST';

  const send = (text) => {
    if (!text.trim()) return;
    setThread(prev => [...prev, { id: msgId++, sender: 'field', text: text.trim(), time: now() }]);
    setInput('');
    setTimeout(() => {
      setThread(prev => [...prev, { id: msgId++, sender: 'system', text: parseReply(text), time: now() }]);
    }, 700);
  };

  const handleEmergency = (e) => {
    e.preventDefault();
    const txt = `EMERGENCY | SEC:${emgForm.section.replace(/\s/g,'')} | KM:${emgForm.km} | TYPE:${emgForm.type} | DEPT:${authKey} | NOTE:${emgForm.details}`;
    send(txt);
    setEmgSent(true);
    setTab('sms');
    setTimeout(() => setEmgSent(false), 5000);
    setEmgForm({ section: '', km: '', type: 'RAIL_FRACTURE', details: '' });
  };

  return (
    <div className="dept-dispatch-page">

      {/* ── Header ────────────────────────────────── */}
      <header className="dept-dispatch__header">
        <div>
          <div
            className="dept-badge"
            style={{ color: meta.color, background: meta.colorLight, borderColor: meta.colorBorder }}
          >
            <span className="dept-badge__dot" style={{ background: meta.color, boxShadow: `0 0 8px ${meta.color}` }} />
            {meta.icon} {meta.short} · FIELD DISPATCH &amp; EMERGENCY REPORTING
          </div>
          <h1 className="dept-dispatch__title">
            SMS Dispatch &amp; <span style={{ color: meta.color }}>Emergency Reporting</span>
          </h1>
          <p className="dept-dispatch__meta">
            Send block requests and clearances via SMS — works on 2G feature phones with zero data coverage.
            Report emergencies instantly to the Section Controller.
          </p>
        </div>
        <button className="dept-btn-outline" onClick={() => onNavigate('dept-dashboard')}>
          ← Dashboard
        </button>
      </header>

      {/* ── Emergency sent banner ──────────────────── */}
      {emgSent && (
        <div className="dept-emg-banner">
          🚨 Emergency report dispatched! Section Controller &amp; Emergency PWI Gang notified. Check the SMS terminal for your Private Number.
        </div>
      )}

      {/* ── Channel status ────────────────────────── */}
      <div className="dept-channels">
        {[
          { name: 'WhatsApp Gateway',           status: 'ACTIVE',   detail: 'Rich media + PDF permits (4G/Wi-Fi)' },
          { name: 'GSM 2G SMS Gateway',          status: 'STANDBY',  detail: 'Works on feature phones · ₹0.15/SMS' },
          { name: 'IVR Voice (Emergency Only)',  status: 'STANDBY',  detail: 'Automated Hindi/English voice calls' },
        ].map(ch => (
          <div key={ch.name} className={`dept-channel ${ch.status === 'ACTIVE' ? 'active' : ''}`}>
            <div className="dept-channel__dot" style={{ background: ch.status === 'ACTIVE' ? '#059669' : '#94a3b8' }} />
            <div>
              <div className="dept-channel__name">{ch.name}</div>
              <div className="dept-channel__detail">{ch.detail}</div>
            </div>
            <span className={`dept-channel__badge ${ch.status === 'ACTIVE' ? 'active' : ''}`}>{ch.status}</span>
          </div>
        ))}
      </div>

      {/* ── Tabs ──────────────────────────────────── */}
      <div className="dept-dispatch-tabs">
        <button
          className={`dept-dispatch-tab ${tab === 'sms' ? 'active' : ''}`}
          style={tab === 'sms' ? { borderBottomColor: meta.color, color: meta.color } : {}}
          onClick={() => setTab('sms')}
        >
          📡 SMS Terminal
        </button>
        <button
          className={`dept-dispatch-tab ${tab === 'emergency' ? 'active' : ''}`}
          style={tab === 'emergency' ? { borderBottomColor: '#b91c1c', color: '#b91c1c' } : {}}
          onClick={() => setTab('emergency')}
        >
          🚨 Report Emergency
        </button>
      </div>

      {/* ══ SMS Terminal ══════════════════════════════ */}
      {tab === 'sms' && (
        <div className="dept-sms-layout">

          <div className="dept-sms-card">
            <div className="dept-sms-card__header">
              <span className="dept-sms-signal">📶 RailTel GSM · {meta.short} Field Handset</span>
              <span className="dept-sms-title">Field SMS Handshake Simulator</span>
            </div>

            <div className="dept-sms-thread">
              {thread.map(msg => (
                <div
                  key={msg.id}
                  className={`dept-sms-bubble ${msg.sender === 'field' ? 'bubble-field' : msg.sender === 'system' ? 'bubble-system' : 'bubble-info'}`}
                >
                  <div className="dept-sms-bubble__sender">
                    {msg.sender === 'field'  ? `${currentUser?.name || 'Field Officer'} (${meta.short})` :
                     msg.sender === 'system' ? 'Sahayak Rail CRIS AI Dispatch' : 'System'}
                  </div>
                  <div className="dept-sms-bubble__text font-mono">{msg.text}</div>
                  <div className="dept-sms-bubble__time">{msg.time}</div>
                </div>
              ))}
            </div>

            <div className="dept-sms-quick">
              <span className="dept-sms-quick__label">Quick Messages:</span>
              <div className="dept-sms-quick__btns">
                {quickMsgs.map(q => (
                  <button
                    key={q.label}
                    className="dept-sms-quick__btn"
                    style={{ borderColor: meta.colorBorder, color: meta.color }}
                    onClick={() => send(q.text)}
                  >
                    {q.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="dept-sms-input-row">
              <input
                className="dept-sms-input font-mono"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send(input)}
                placeholder="Type block request SMS e.g. BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DEPT:ENGG | TYPE:TRACK_TAMP | DUR:3HR"
              />
              <button
                className="dept-sms-send"
                style={{ background: meta.color }}
                onClick={() => send(input)}
                disabled={!input.trim()}
              >
                Send
              </button>
            </div>
          </div>

          {/* Syntax help panel */}
          <div className="dept-sms-help">
            <div className="dept-sms-help__title">SMS Message Format</div>
            <p className="dept-sms-help__note">
              You send a block request. The system logs it and forwards to COA — that's all. COA handles scheduling, approval and Private Number issuance.
            </p>
            <div className="dept-sms-help__rows">
              <div className="dept-sms-help__row">
                <span className="dept-sms-help__tag" style={{ background: meta.colorLight, color: meta.color }}>Block Request</span>
                <code>BLOCK REQ | SEC:&lt;FROM-TO&gt; | KM:&lt;X-Y&gt; | DEPT:{authKey} | TYPE:&lt;TYPE&gt; | DUR:&lt;N&gt;HR</code>
              </div>
              <div className="dept-sms-help__row">
                <span className="dept-sms-help__tag" style={{ background: '#fef2f2', color: '#b91c1c' }}>Emergency Only</span>
                <code>EMERGENCY | SEC:&lt;FROM-TO&gt; | KM:&lt;X&gt; | TYPE:&lt;TYPE&gt; | DEPT:{authKey}</code>
              </div>
            </div>
            <div className="dept-sms-help__response">
              <div className="dept-sms-help__response-title">System Response</div>
              <div className="dept-sms-help__response-body font-mono">
                ✅ SAHAYAK RAIL SYSTEM: Block request received and logged. Request ID: REQ-SMS-XXXXX. Forwarded to COA for review and scheduling. No further action needed from your side.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ Emergency Report Form ═════════════════════ */}
      {tab === 'emergency' && (
        <div className="dept-emg-section">
          <div className="dept-emg-warning">
            ⚠️ Use this only for genuine track-safety emergencies. Submitting will immediately alert the Section Controller and dispatch an Emergency PWI Gang.
          </div>

          <div className="dept-emg-card">
            <div className="dept-emg-card__header">
              <span className="dept-emg-icon">🚨</span>
              <div>
                <h2 className="dept-emg-card__title">Emergency Incident Report</h2>
                <p className="dept-emg-card__sub">
                  An Emergency Private Number will be auto-generated and logged in the COA audit trail.
                </p>
              </div>
            </div>

            <form className="dept-emg-form" onSubmit={handleEmergency}>
              <div className="dept-form__row">
                <div className="dept-form__field">
                  <label>Affected Section / Corridor</label>
                  <input
                    className="dept-input dept-input--emg"
                    value={emgForm.section}
                    onChange={e => setEmgForm(f => ({ ...f, section: e.target.value }))}
                    placeholder="e.g. NDLS–GZB"
                    required
                  />
                </div>
                <div className="dept-form__field" style={{ maxWidth: 150 }}>
                  <label>KM Mark</label>
                  <input
                    className="dept-input dept-input--emg"
                    value={emgForm.km}
                    onChange={e => setEmgForm(f => ({ ...f, km: e.target.value }))}
                    placeholder="e.g. 128.40"
                    required
                  />
                </div>
              </div>

              <div className="dept-form__field">
                <label>Incident Type</label>
                <select
                  className="dept-input dept-input--emg"
                  value={emgForm.type}
                  onChange={e => setEmgForm(f => ({ ...f, type: e.target.value }))}
                >
                  {INCIDENT_TYPES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>

              <div className="dept-form__field">
                <label>Description / Observations</label>
                <textarea
                  className="dept-input dept-textarea dept-input--emg"
                  value={emgForm.details}
                  onChange={e => setEmgForm(f => ({ ...f, details: e.target.value }))}
                  rows={4}
                  placeholder="Describe what you see — condition, extent, immediate risk to trains…"
                  required
                />
              </div>

              <div className="dept-emg-form__footer">
                <div className="dept-emg-form__from">
                  Reporting as: <strong>{currentUser?.name}</strong> · {meta.short} Department
                </div>
                <button type="submit" className="dept-emg-submit-btn">
                  🚨 Send Emergency Alert Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
