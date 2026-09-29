import React, { useState } from 'react';
import './FieldDispatchPage.css';

export default function FieldDispatchPage({ onNavigate }) {
  const [smsInput, setSmsInput] = useState('BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DEPT:ENGG | TYPE:TRACK_TAMP | DUR:3HR');
  const [parsedData, setParsedData] = useState({
    section: 'NDLS – GZB (KM 127.40 – 128.80)',
    department: 'Engineering (P-Way Gang #4)',
    activity: 'Mechanised Track Tamping (CSM-92)',
    requestedDuration: '3.0 Hours',
    privateNumber: 'PN-884102-DLI',
    status: 'PARSED & APPROVED VIA CP-SAT',
    timestamp: '10-Sep-2026 00:28:15 IST'
  });

  const [messageThread, setMessageThread] = useState([
    {
      sender: 'field',
      text: 'BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DEPT:ENGG | TYPE:TRACK_TAMP | DUR:3HR',
      time: '00:27 IST'
    },
    {
      sender: 'system',
      text: 'SAHAYAK RAIL DLI-CONTROL: BLOCK APPROVED. Window: 00:30-04:00 (3.5h Bundled with S&T Point 104). PRIVATE NUMBER: PN-884102-DLI. Caution Order 30 km/h imposed. Reply CONFIRM to occupy track.',
      time: '00:28 IST'
    },
    {
      sender: 'field',
      text: 'CONFIRM | PN:884102-DLI | PWI_SHARMA | TRACK OCCUPIED',
      time: '00:31 IST'
    }
  ]);

  const [showT348M, setShowT348M] = useState(false);

  const handleSendTestSms = (text) => {
    setSmsInput(text);
    const newMsg = { sender: 'field', text, time: 'Just now' };
    setMessageThread((prev) => [...prev, newMsg]);

    setTimeout(() => {
      let replyText = '';
      if (text.includes('CLEAR')) {
        replyText = 'SAHAYAK RAIL DLI-CONTROL: BLOCK CLEARED & CANCELLED. Private Number PN-992140-CANCEL registered. Track returned to Traffic Control at 03:52 IST. Caution Order 30 km/h active for 24h.';
        setParsedData({
          section: 'NDLS – GZB (KM 127 – 128)',
          department: 'Engineering (P-Way)',
          activity: 'Track Cleared & Safe for Traffic',
          requestedDuration: 'Block Complete',
          privateNumber: 'PN-992140-CANCEL',
          status: 'POSSESSION RELINQUISHED (TRACK CLEAR)',
          timestamp: '10-Sep-2026 03:52:10 IST'
        });
      } else {
        replyText = 'SAHAYAK RAIL DLI-CONTROL: BLOCK APPROVED. Window: 01:00-03:30. PRIVATE NUMBER: PN-773019-DLI. Form T/348M dispatched. Reply OK.';
        setParsedData({
          section: 'GZB – ALJN (KM 64 – 68)',
          department: 'P-Way USFD Testing Gang',
          activity: 'Ultrasonic Rail Flaw Verification',
          requestedDuration: '2.5 Hours',
          privateNumber: 'PN-773019-DLI',
          status: 'VERIFIED & REGISTERED',
          timestamp: '10-Sep-2026 00:45:00 IST'
        });
      }
      setMessageThread((prev) => [...prev, { sender: 'system', text: replyText, time: 'Just now' }]);
    }, 600);
  };

  return (
    <div className="field-page">
      <header className="field-header">
        <div className="field-header__left">
          <div className="field-header__badge">
            <span className="field-header__dot"></span>
            KEY DIFFERENTIATOR • USP #1 (LOW-CONNECTIVITY 2G SMS / WHATSAPP DISPATCH)
          </div>
          <h1 className="field-header__title">
            Field Personnel <span>2G SMS & Dispatch Terminal</span>
          </h1>
          <p className="field-header__subtitle">
            Most railway tracks pass through areas with zero 4G/5G data coverage. Sahayak Rail equips track gangmen, PWIs, and S&T supervisors with 2-way SMS/IVR fallback protocols and digital Form T/348M generation.
          </p>
        </div>

        <div className="field-header__actions">
          <button className="field-btn-secondary" onClick={() => onNavigate('dashboard')}>
            ← Return to Dashboard
          </button>
          <button className="field-btn-primary" onClick={() => setShowT348M(!showT348M)}>
            {showT348M ? 'Hide Form T/348M' : 'View Official Form T/348M PTW'}
          </button>
        </div>
      </header>

      {/* Fallback Connectivity Multi-Channel Indicator */}
      <section className="field-channel-ladder">
        <div className="channel-card active">
          <div className="channel-card__status">CHANNEL 1: ACTIVE</div>
          <div className="channel-card__name">WhatsApp Business Gateway</div>
          <div className="channel-card__meta">Rich media, PDF permits, GPS location tagging (4G/Wi-Fi)</div>
        </div>

        <div className="channel-card active">
          <div className="channel-card__status">CHANNEL 2: STANDBY / ACTIVE</div>
          <div className="channel-card__name">GSM 2G SMS Gateway</div>
          <div className="channel-card__meta">Works on feature phones, 0 bars data, ₹0.15/SMS (NIC/RailTel)</div>
        </div>

        <div className="channel-card standby">
          <div className="channel-card__status">CHANNEL 3: EMERGENCY STANDBY</div>
          <div className="channel-card__name">Automated IVR Voice Synthesizer</div>
          <div className="channel-card__meta">Automated Hindi/English phone calls for urgent block revocations</div>
        </div>
      </section>

      {/* Two Column: Interactive SMS Simulator & Extracted Data Card */}
      <div className="field-two-col">
        {/* SMS Simulator Terminal */}
        <section className="sms-terminal-card">
          <div className="sms-terminal-header">
            <div className="phone-indicator">
              <span className="carrier">RailTel GSM (2G)</span>
              <span className="signal">📶 2 Bars • SMS Service Only</span>
            </div>
            <div className="terminal-title">Field SMS Handshake Simulator</div>
          </div>

          <div className="sms-thread-body">
            {messageThread.map((msg, i) => (
              <div key={i} className={`sms-bubble ${msg.sender === 'field' ? 'bubble-field' : 'bubble-system'}`}>
                <div className="sms-bubble__sender">
                  {msg.sender === 'field' ? 'PWI Gangman (Field Handset)' : 'Sahayak Rail CRIS AI Dispatch'}
                </div>
                <div className="sms-bubble__text font-mono">{msg.text}</div>
                <div className="sms-bubble__time">{msg.time}</div>
              </div>
            ))}
          </div>

          <div className="sms-quick-tests">
            <span className="quick-label">Simulate Real Field Messages:</span>
            <button
              className="quick-btn"
              onClick={() => handleSendTestSms('BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DEPT:ENGG | TYPE:TRACK_TAMP | DUR:3HR')}
            >
              1. Submit Block Request
            </button>
            <button
              className="quick-btn"
              onClick={() => handleSendTestSms('BLOCK CLEAR | SEC:NDL-GZB | KM:127-128 | PN:884102 | TRACK:FIT_30KMH')}
            >
              2. Confirm Track Clearance
            </button>
            <button
              className="quick-btn"
              onClick={() => handleSendTestSms('EMERGENCY STOP | SEC:GZB-ALJN | KM:64 | RAIL_FRACTURE')}
            >
              3. Report Emergency Fracture
            </button>
          </div>

          <div className="sms-input-row">
            <input
              type="text"
              className="sms-input-field font-mono"
              value={smsInput}
              onChange={(e) => setSmsInput(e.target.value)}
              placeholder="Enter SMS string..."
            />
            <button className="sms-send-btn" onClick={() => handleSendTestSms(smsInput)}>
              Send SMS
            </button>
          </div>
        </section>

        {/* NLP Parser Breakdown & Private Number Card */}
        <section className="nlp-parser-card">
          <div className="nlp-header">
            <h3>Automated Gateway Syntax Parser & Validator</h3>
            <span className="nlp-status-pill">{parsedData.status}</span>
          </div>

          <div className="private-number-hero">
            <span className="pn-label">CRYPTOGRAPHIC PRIVATE NUMBER (PN)</span>
            <span className="pn-code font-mono">{parsedData.privateNumber}</span>
            <span className="pn-meta">Authorized under Indian Railways General Rules (G&SR Para 4.09)</span>
          </div>

          <div className="nlp-extracted-grid">
            <div className="nlp-item">
              <span className="label">Corridor Section:</span>
              <span className="val text-white">{parsedData.section}</span>
            </div>
            <div className="nlp-item">
              <span className="label">Department / Unit:</span>
              <span className="val text-cyan">{parsedData.department}</span>
            </div>
            <div className="nlp-item">
              <span className="label">Maintenance Scope:</span>
              <span className="val text-emerald">{parsedData.activity}</span>
            </div>
            <div className="nlp-item">
              <span className="label">Authorized Duration:</span>
              <span className="val text-amber">{parsedData.requestedDuration}</span>
            </div>
            <div className="nlp-item full-width">
              <span className="label">Audit Timestamp:</span>
              <span className="val font-mono">{parsedData.timestamp}</span>
            </div>
          </div>

          <div className="nlp-safety-check">
            <strong>Safety Interlocking Checklist:</strong>
            <ul>
              <li>✓ Section Controller Private Number Exchange Verified</li>
              <li>✓ Station Master (Palwal & Kosi Kalan) Block Instruments Locked</li>
              <li>✓ 25kV OHE Isolation Memo Served to Traction Power Controller</li>
              <li>✓ Detonator Protection at 600m & 1200m Banner Flag Placed</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Official Form T/348M Modal / Card */}
      {showT348M && (
        <section className="t348m-section">
          <div className="t348m-document">
            <div className="t348m-header">
              <div className="t348m-emblem">🚆 INDIAN RAILWAYS / NORTHERN RAILWAY</div>
              <h2>FORM T/348M (REVISED 2024)</h2>
              <h3>NOTICE OF IMPOSITION / CANCELLATION OF SPEED RESTRICTION & ENGINEERING BLOCK</h3>
              <div className="t348m-meta">
                <span>Division: Delhi (DLI)</span>
                <span>Serial No: T348M-2026-DLI-0984</span>
                <span>Date: 10-September-2026</span>
              </div>
            </div>

            <div className="t348m-body">
              <p>
                <strong>To:</strong> Station Masters: NDLS, PWL, KSV, MTJ | Chief Train Controller (Coaching & Goods) | Traction Power Controller (TRD)
              </p>
              <p>
                Notice is hereby given that an <strong>Integrated Engineering Possession (Shadow Block)</strong> has been sanctioned by Section Controller under Computerized Scheduling Authority (Sahayak Rail).
              </p>

              <table className="t348m-table">
                <tbody>
                  <tr>
                    <td><strong>Line & Section:</strong></td>
                    <td>UP Main Line, Delhi – Agra Cantt Section</td>
                    <td><strong>Kilometer Limits:</strong></td>
                    <td>KM 127/40 to KM 129/20</td>
                  </tr>
                  <tr>
                    <td><strong>Block Imposition Time:</strong></td>
                    <td>00:30 Hours IST</td>
                    <td><strong>Estimated Clearance:</strong></td>
                    <td>04:00 Hours IST (3 Hours 30 Mins)</td>
                  </tr>
                  <tr>
                    <td><strong>Departments Engaged:</strong></td>
                    <td>P-Way (CSM Tamping) + S&T (Point 104) + TRD (Catenary Stagger)</td>
                    <td><strong>Private Number (PN):</strong></td>
                    <td className="text-cyan font-mono font-bold">PN-884102-DLI</td>
                  </tr>
                  <tr>
                    <td><strong>Speed Restriction (TSR):</strong></td>
                    <td>30 km/h (Dead Slow over newly tamped track)</td>
                    <td><strong>OHE Status:</strong></td>
                    <td>25kV Power Block Granted (Permit #TRD-882)</td>
                  </tr>
                </tbody>
              </table>

              <div className="t348m-signatures">
                <div className="sig-block">
                  <div className="sig-line">R. K. Sharma (Sr. Section Engineer / P-Way)</div>
                  <span>Signature of Field Supervisor</span>
                </div>
                <div className="sig-block">
                  <div className="sig-line">A. K. Verma (Chief Train Controller / DLI)</div>
                  <span>Signature of Section Controller</span>
                </div>
                <div className="sig-block">
                  <div className="sig-seal">SAHAYAK RAIL AI SOLVER AUDIT SEAL • 10-09-2026</div>
                  <span>CRIS Automated Dispatch Verified</span>
                </div>
              </div>
            </div>

            <div className="t348m-toolbar">
              <button className="t348m-print-btn" onClick={() => window.print()}>
                🖨️ Print / Save Official Form T/348M (PDF)
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
