import React, { useState } from 'react';
import { FINALISED_SCHEDULE, MOCK_REQUESTS } from './COADashboardPage';
import './COASchedulePage.css';

const TYPE_COLOR = {
  bundle: { label: '⭐ Shadow Bundle', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  pway:   { label: '🛤️ P-Way',         color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  snt:    { label: '🚦 S&T',            color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  trd:    { label: '⚡ TRD',            color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};

function parseWindow(w) {
  // e.g. "00:30–04:00 (3.5h)"  or  "00:30–04:00"
  const match = w.match(/(\d{2}:\d{2})[–-](\d{2}:\d{2})/);
  if (!match) return { start: w, end: '' };
  return { start: match[1], end: match[2] };
}

function EditModal({ block, onSave, onClose }) {
  const parsed = parseWindow(block.window);
  const [start, setStart] = useState(parsed.start);
  const [end,   setEnd]   = useState(parsed.end);
  const [tsr,   setTsr]   = useState(block.tsr);
  const [dept,  setDept]  = useState(block.dept);

  const handleSave = () => {
    onSave({ ...block, window: `${start}–${end}`, tsr, dept });
    onClose();
  };

  return (
    <div className="coa-modal-overlay" onClick={onClose}>
      <div className="coa-modal" onClick={e => e.stopPropagation()}>
        <div className="coa-modal__header">
          <h3>Edit Block — <span className="font-mono">{block.blockId}</span></h3>
          <button className="coa-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="coa-modal__body">
          <div className="coa-modal__field">
            <label>Title</label>
            <input className="coa-modal__input" value={block.title} readOnly />
          </div>
          <div className="coa-modal__field">
            <label>Section</label>
            <input className="coa-modal__input" value={block.section} readOnly />
          </div>
          <div className="coa-modal__row">
            <div className="coa-modal__field">
              <label>Start Time</label>
              <input
                type="time"
                className="coa-modal__input"
                value={start}
                onChange={e => setStart(e.target.value)}
              />
            </div>
            <div className="coa-modal__field">
              <label>End Time</label>
              <input
                type="time"
                className="coa-modal__input"
                value={end}
                onChange={e => setEnd(e.target.value)}
              />
            </div>
          </div>
          <div className="coa-modal__field">
            <label>Department(s)</label>
            <input
              className="coa-modal__input"
              value={dept}
              onChange={e => setDept(e.target.value)}
            />
          </div>
          <div className="coa-modal__field">
            <label>TSR / Speed Restriction</label>
            <input
              className="coa-modal__input"
              value={tsr}
              onChange={e => setTsr(e.target.value)}
            />
          </div>
        </div>

        <div className="coa-modal__footer">
          <button className="coa-modal-btn coa-modal-btn--cancel" onClick={onClose}>Cancel</button>
          <button className="coa-modal-btn coa-modal-btn--save" onClick={handleSave}>Save Changes</button>
        </div>
      </div>
    </div>
  );
}

export default function COASchedulePage({ onNavigate, currentUser }) {
  const [blocks, setBlocks] = useState(FINALISED_SCHEDULE);
  const [editTarget, setEditTarget] = useState(null);
  const [finalLocked, setFinalLocked] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  /* find linked requests for a block */
  const linkedReqs = (ids) => MOCK_REQUESTS.filter(r => ids.includes(r.id));

  const approveBlock = (blockId) => {
    setBlocks(prev => prev.map(b =>
      b.blockId === blockId ? { ...b, status: 'APPROVED', privateNo: b.privateNo || `PN-${Math.floor(100000 + Math.random() * 899999)}-DLI` } : b
    ));
  };

  const rejectBlock = (blockId) => {
    setBlocks(prev => prev.filter(b => b.blockId !== blockId));
  };

  const saveEdit = (updated) => {
    setBlocks(prev => prev.map(b => b.blockId === updated.blockId ? updated : b));
  };

  const lockFinalSchedule = () => {
    // Mark all pending as approved
    setBlocks(prev => prev.map(b =>
      b.status !== 'APPROVED'
        ? { ...b, status: 'APPROVED', privateNo: b.privateNo || `PN-${Math.floor(100000 + Math.random() * 899999)}-DLI` }
        : b
    ));
    setFinalLocked(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const approved = blocks.filter(b => b.status === 'APPROVED');
  const pending  = blocks.filter(b => b.status !== 'APPROVED');

  /* ── Gantt helpers ─────────────────────────────── */
  const toPercent = (timeStr) => {
    const [h, m] = timeStr.split(':').map(Number);
    return ((h * 60 + m) / 1440) * 100;
  };
  const widthPercent = (start, end) => {
    const s = toPercent(start);
    const e = toPercent(end);
    return e > s ? e - s : 0;
  };

  return (
    <div className="coa-sched-page">
      {/* ── Header ────────────────────────────────────── */}
      <header className="coa-sched-page__header">
        <div>
          <div className="coa-badge">
            <span className="coa-badge__dot"></span>
            COA • FINAL MAINTENANCE BLOCK SCHEDULE
          </div>
          <h1 className="coa-sched-page__title">
            Schedule Editor <span>& Approval</span>
          </h1>
          <p className="coa-sched-page__meta">
            Review each allocated block, edit if needed, approve individually — then lock the Final Schedule to issue all Private Numbers.
          </p>
        </div>
        <div className="coa-sched-page__actions">
          <button className="coa-btn-outline" onClick={() => onNavigate('coa-requests')}>
            ← Back to Requests
          </button>
          {!finalLocked && (
            <button
              className="coa-btn-lock"
              onClick={lockFinalSchedule}
              disabled={blocks.length === 0}
            >
              🔒 Lock & Issue Final Schedule
            </button>
          )}
          {finalLocked && (
            <span className="coa-locked-badge">🔒 Schedule Locked & Issued</span>
          )}
        </div>
      </header>

      {/* ── Success Banner ─────────────────────────────── */}
      {showSuccess && (
        <div className="coa-success-banner">
          ✅ Final Schedule locked! All Private Numbers issued. Form T/348M dispatched to field personnel.
        </div>
      )}

      {/* ── Stats Strip ────────────────────────────────── */}
      <div className="coa-sched-stats">
        <div className="coa-sched-stat">
          <span className="coa-sched-stat__num">{blocks.length}</span>
          <span className="coa-sched-stat__lbl">Total Blocks</span>
        </div>
        <div className="coa-sched-stat">
          <span className="coa-sched-stat__num" style={{ color: '#10B981' }}>{approved.length}</span>
          <span className="coa-sched-stat__lbl">Approved</span>
        </div>
        <div className="coa-sched-stat">
          <span className="coa-sched-stat__num" style={{ color: '#F59E0B' }}>{pending.length}</span>
          <span className="coa-sched-stat__lbl">Pending Approval</span>
        </div>
        <div className="coa-sched-stat">
          <span className="coa-sched-stat__num" style={{ color: '#3B82F6' }}>
            {approved.filter(b => b.type === 'bundle').length}
          </span>
          <span className="coa-sched-stat__lbl">Shadow Bundles</span>
        </div>
      </div>

      {/* ── Gantt Preview ──────────────────────────────── */}
      <section className="coa-gantt-section">
        <h2 className="coa-gantt-title">24-Hour Block Timeline Preview</h2>
        <div className="coa-gantt">
          {/* Time axis */}
          <div className="coa-gantt-axis">
            {Array.from({ length: 25 }).map((_, i) => (
              <div key={i} className="coa-gantt-tick">
                <span>{String(i).padStart(2, '0')}:00</span>
              </div>
            ))}
          </div>
          {/* Track rows */}
          {['UP Main Line', 'DOWN Main Line', 'Goods Loop'].map(track => {
            const trackBlocks = blocks.filter(b => {
              if (track === 'UP Main Line') return b.section.includes('UP Main') || b.section.includes('NDLS–AGC') || b.section.includes('GZB–ALJN');
              if (track === 'DOWN Main Line') return b.section.includes('AGC–') || b.section.includes('DOWN');
              return b.section.includes('Loop') || b.section.includes('Yard');
            });
            return (
              <div key={track} className="coa-gantt-row">
                <div className="coa-gantt-row__label">{track}</div>
                <div className="coa-gantt-row__timeline">
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div key={i} className="coa-gantt-gridline" style={{ left: `${(i / 24) * 100}%` }} />
                  ))}
                  {trackBlocks.map(b => {
                    const p = parseWindow(b.window);
                    if (!p.start || !p.end) return null;
                    const left  = toPercent(p.start);
                    const width = widthPercent(p.start, p.end);
                    const tc = TYPE_COLOR[b.type] || TYPE_COLOR.pway;
                    return (
                      <div
                        key={b.blockId}
                        className="coa-gantt-block"
                        style={{
                          left: `${left}%`,
                          width: `${width}%`,
                          background: tc.bg,
                          borderLeft: `3px solid ${tc.color}`,
                        }}
                        title={`${b.title} — ${b.window}`}
                      >
                        <span className="coa-gantt-block__text">{b.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Pending Approval Blocks ─────────────────── */}
      {pending.length > 0 && !finalLocked && (
        <section className="coa-block-section">
          <h2 className="coa-block-section__title">
            ⏳ Pending Your Approval
            <span className="coa-block-section__count">{pending.length}</span>
          </h2>
          <div className="coa-block-cards">
            {pending.map(blk => {
              const tc = TYPE_COLOR[blk.type] || TYPE_COLOR.pway;
              const reqs = linkedReqs(blk.requests);
              return (
                <div key={blk.blockId} className="coa-block-card coa-block-card--pending">
                  <div className="coa-block-card__header">
                    <div>
                      <span className="coa-block-id font-mono">{blk.blockId}</span>
                      <span
                        className="coa-block-type"
                        style={{ background: tc.bg, color: tc.color }}
                      >
                        {tc.label}
                      </span>
                    </div>
                    <span className="coa-block-pending-badge">⏳ Awaiting Approval</span>
                  </div>

                  <h3 className="coa-block-title">{blk.title}</h3>

                  <div className="coa-block-details">
                    <div className="coa-block-detail"><span>📍 Section</span><strong>{blk.section}</strong></div>
                    <div className="coa-block-detail"><span>🕐 Window</span><strong>{blk.window}</strong></div>
                    <div className="coa-block-detail"><span>🏢 Dept</span><strong>{blk.dept}</strong></div>
                    <div className="coa-block-detail"><span>⚠️ TSR</span><strong>{blk.tsr}</strong></div>
                  </div>

                  {/* Linked requests */}
                  {reqs.length > 0 && (
                    <div className="coa-block-linked">
                      <div className="coa-block-linked__title">Linked Requests:</div>
                      {reqs.map(r => (
                        <span key={r.id} className="coa-linked-tag">{r.id} — {r.activity}</span>
                      ))}
                    </div>
                  )}

                  <div className="coa-block-card__actions">
                    <button
                      className="coa-action-btn coa-action-btn--approve"
                      onClick={() => approveBlock(blk.blockId)}
                    >
                      ✅ Approve & Issue PN
                    </button>
                    <button
                      className="coa-action-btn coa-action-btn--edit"
                      onClick={() => setEditTarget(blk)}
                    >
                      ✏️ Edit Before Approving
                    </button>
                    <button
                      className="coa-action-btn coa-action-btn--reject"
                      onClick={() => rejectBlock(blk.blockId)}
                    >
                      ✗ Decline
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Approved Blocks (Final Schedule) ─────────── */}
      <section className="coa-block-section">
        <h2 className="coa-block-section__title">
          {finalLocked ? '🔒 Final Locked Schedule' : '✅ Approved Blocks'}
          <span className="coa-block-section__count">{approved.length}</span>
        </h2>

        {approved.length === 0 && (
          <div className="coa-empty">No approved blocks yet. Approve blocks above.</div>
        )}

        <div className="coa-block-cards">
          {approved.map(blk => {
            const tc = TYPE_COLOR[blk.type] || TYPE_COLOR.pway;
            const reqs = linkedReqs(blk.requests);
            return (
              <div key={blk.blockId} className="coa-block-card coa-block-card--approved">
                <div className="coa-block-card__header">
                  <div>
                    <span className="coa-block-id font-mono">{blk.blockId}</span>
                    <span
                      className="coa-block-type"
                      style={{ background: tc.bg, color: tc.color }}
                    >
                      {tc.label}
                    </span>
                  </div>
                  <span className="coa-block-approved-badge">✓ Approved</span>
                </div>

                <h3 className="coa-block-title">{blk.title}</h3>

                <div className="coa-block-details">
                  <div className="coa-block-detail"><span>📍 Section</span><strong>{blk.section}</strong></div>
                  <div className="coa-block-detail"><span>🕐 Window</span><strong>{blk.window}</strong></div>
                  <div className="coa-block-detail"><span>🏢 Dept</span><strong>{blk.dept}</strong></div>
                  <div className="coa-block-detail"><span>⚠️ TSR</span><strong>{blk.tsr}</strong></div>
                </div>

                {blk.privateNo && (
                  <div className="coa-block-pn">
                    <span>🔑 Private Number:</span>
                    <strong className="font-mono coa-pn-val">{blk.privateNo}</strong>
                  </div>
                )}

                {reqs.length > 0 && (
                  <div className="coa-block-linked">
                    <div className="coa-block-linked__title">Requests covered:</div>
                    {reqs.map(r => (
                      <span key={r.id} className="coa-linked-tag coa-linked-tag--done">{r.id} — {r.activity}</span>
                    ))}
                  </div>
                )}

                {!finalLocked && (
                  <div className="coa-block-card__actions">
                    <button
                      className="coa-action-btn coa-action-btn--edit"
                      onClick={() => setEditTarget(blk)}
                    >
                      ✏️ Edit Window / TSR
                    </button>
                    <button
                      className="coa-action-btn coa-action-btn--reject"
                      onClick={() => rejectBlock(blk.blockId)}
                    >
                      ✗ Remove from Schedule
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Lock CTA if all approved ─────────────────── */}
      {!finalLocked && approved.length > 0 && pending.length === 0 && (
        <div className="coa-lock-cta">
          <div>
            <div className="coa-lock-cta__title">All blocks approved. Ready to issue the Final Schedule?</div>
            <div className="coa-lock-cta__sub">
              This will lock the schedule, issue all Private Numbers, and dispatch Form T/348M to field personnel.
            </div>
          </div>
          <button className="coa-btn-lock" onClick={lockFinalSchedule}>
            🔒 Lock & Issue Final Schedule
          </button>
        </div>
      )}

      {/* ── Edit Modal ──────────────────────────────── */}
      {editTarget && (
        <EditModal
          block={editTarget}
          onSave={saveEdit}
          onClose={() => setEditTarget(null)}
        />
      )}
    </div>
  );
}
