# 🚆 Sahayak Rail (सहायक रेल)
### AI-Powered Multi-Department Maintenance Block Scheduler for Indian Railways

[![Hackwave 3.0](https://img.shields.io/badge/Hackathon-Hackwave%203.0-blueviolet.svg?style=for-the-badge)](https://github.com/Harshwardhans-hub/Hackwave-3.0)
[![Ministry](https://img.shields.io/badge/Ministry-Ministry%20of%20Railways-005494.svg?style=for-the-badge)](https://indianrailways.gov.in/)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208%20%7C%20Leaflet-008080.svg?style=for-the-badge)](https://vitejs.dev/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11%2B%20%7C%20SQLAlchemy-059669.svg?style=for-the-badge)](https://fastapi.tiangolo.com/)
[![AI Solver](https://img.shields.io/badge/AI%20Engine-OR--Tools%20CP--SAT%20Solver-4285F4.svg?style=for-the-badge)](https://developers.google.com/optimization)
[![Regulatory Compliance](https://img.shields.io/badge/Compliance-IRPWM%20%7C%20ACTM%20%7C%20IRSEM-2E7D32.svg?style=for-the-badge)](https://indianrailways.gov.in/)
[![License](https://img.shields.io/badge/License-MIT-gray.svg?style=for-the-badge)](LICENSE)

---

## 📌 Executive Summary

**Sahayak Rail (सहायक रेल)** is a full-stack, mission-critical decision-support and constraint-optimization platform built for **Indian Railways (IR)** and submitted for **Hackwave 3.0**.

Indian Railways manages the world's fourth-largest railway network:
- **68,000+ route kilometers**
- **13,000+ passenger trains daily**
- **8,000+ freight rakes daily**

Maintaining track geometry, 25 kV overhead electrification (OHE), and electronic signalling requires granting **Track Maintenance Blocks (Possessions)** where train traffic is suspended or regulated.

### The Problem
Presently, maintenance coordination across **Permanent Way (P-Way/Civil Engineering)**, **Signal & Telecom (S&T)**, and **Traction Distribution (TRD/Electrical)** takes **3+ hours of manual phone calls, disjointed paper memos, and siloed spreadsheets**. Because departments request blocks independently, the same section is repeatedly closed on separate days—costing 7+ hours of lost throughput per week.

### The Solution
**Sahayak Rail** automates and optimizes this entire lifecycle in **sub-seconds**:
1. Ingests maintenance demands from **TMS**, **SMMS**, and **TDMS**.
2. Synchronizes work orders via **Shadow Block Co-Location**, bundling multi-department possessions into single optimized windows.
3. Employs a **Google OR-Tools CP-SAT Constraint Engine** to de-conflict trains and possessions while prioritizing high-speed corridors (Vande Bharat, Rajdhani) and freight throughput.
4. Provides role-based portals for both **COA Section Controllers** and **Departmental Engineers (P-Way, S&T, TRD)**.
5. Deploys a failsafe **2G GSM SMS field dispatch engine** for remote track corridors lacking 4G/5G mobile connectivity.

---

## 🏛️ System Architecture

```
                                 ┌─────────────────────────────────────────────────────────┐
                                 │                DATA FEEDS & TELEMETRY                   │
                                 │  • TMS (Track Management - TGI, USFD rail flaws)        │
                                 │  • SMMS (Signal Maintenance - Point machines, Track Ckts│
                                 │  • TDMS (Traction Distribution - 25kV Catenary/OHE)     │
                                 │  • COA / FOIS (Train schedules, freight rake manifests) │
                                 │  • IMD Weather Radar (River levels, ghat slip sensors)   │
                                 └───────────────────────────┬─────────────────────────────┘
                                                             │
                                                             ▼
                                 ┌─────────────────────────────────────────────────────────┐
                                 │       FASTAPI BACKEND & OR-TOOLS OPTIMIZER LAYER        │
                                 │                                                         │
                                 │   ┌─────────────────────────────────────────────────┐   │
                                 │   │        Google OR-Tools CP-SAT Solver            │   │
                                 │   │  • Non-overlapping track occupancy constraints │   │
                                 │   │  • Minimum headway buffers (15-min passenger)   │   │
                                 │   │  • Multi-objective delay & penalty minimization │   │
                                 │   └────────────────────────┬────────────────────────┘   │
                                 │                            │                            │
                                 │   ┌────────────────────────┴────────────────────────┐   │
                                 │   │          Shadow Block Co-location Engine        │   │
                                 │   │   Bundles P-Way + S&T + TRD into 1 window       │   │
                                 │   │    Saves 3–4 hrs of separate track closures     │   │
                                 │   └─────────────────────────────────────────────────┘   │
                                 └───────────────────────────┬─────────────────────────────┘
                                                             │
                                                             ▼
                                 ┌─────────────────────────────────────────────────────────┐
                                 │             ROLE-BASED WEB APPLICATION (REACT 19)       │
                                 │  ┌─────────────────────────┐ ┌───────────────────────┐  │
                                 │  │ COA SECTION CONTROLLER  │ │ DEPARTMENT PORTALS    │  │
                                 │  │ • 24h Corridor Gantt    │ │ • P-Way Civil Engg    │  │
                                 │  │ • Block Approval/Reject │ │ • S&T Signalling      │  │
                                 │  │ • Emergency Insertion   │ │ • TRD 25kV Catenary   │  │
                                 │  │ • Private Number Issuance│ │ • Work Order Bidding  │  │
                                 │  └─────────────────────────┘ └───────────────────────┘  │
                                 └───────────────────────────┬─────────────────────────────┘
                                                             │
                                                             ▼
                                 ┌─────────────────────────────────────────────────────────┐
                                 │         MULTI-TIER FAILSAFE FIELD DISPATCH              │
                                 │   Tier 1: Web Interface & WhatsApp Business API         │
                                 │      │  (Fallback on low-bandwidth / poor connectivity)  │
                                 │   Tier 2: Two-Way GSM SMS Gateway (Works on 2G phones)  │
                                 │      │  (Emergency fallback)                            │
                                 │   Tier 3: IVR Automated Voice Confirmation              │
                                 │   Output: Official Digital Form T/348M & Private Numbers│
                                 └─────────────────────────────────────────────────────────┘
```

---

## ⚡ Key Architectural Pillars (USPs)

### 1. 🧩 Multi-Objective AI Constraint Solver (OR-Tools CP-SAT)
- Formulates maintenance block allocation as a mixed-integer constraint satisfaction problem.
- **Hard Constraints**: Zero physical block collisions on the same track line, train headway safety spacing (15-min passenger headway), and machine transit times.
- **Soft Objectives**: Minimizes passenger delay penalty (weighted by train category: Vande Bharat/Rajdhani > Express > Passenger), freight throughput loss, and maintenance deferral risk.
- **Shadow Block Co-Location**: Automatically identifies co-located work orders (e.g., P-Way track tamping + S&T point machine overhaul + TRD 25kV catenary de-energization) and bundles them into a single window, slashing sectional downtime by up to 60%.

### 2. 🔍 Explainable AI (XAI) & Regulatory Citations
- Replaces black-box schedules with **auditable regulatory justifications**:
  - Exact rule citations from **IRPWM Para 808** (Track Geometry Index & USFD testing), **ACTM Vol II Para 2063** (25kV OHE isolation & permit-to-work), and **IRSEM Section 3** (Point machine disconnection memos).
  - Relative feature importance (SHAP-inspired breakdown): TGI Defect Urgency, Section Traffic Gap, Power Block Interlock, and Crew Proximity.

### 3. 🛡️ Human-in-the-Loop (HITL) Controller Governance
- Indian Railways operating discipline requires executive authority: the **Section Controller retains 100% discretion** to **Approve**, **Modify**, or **Reject** any schedule.
- Instant issuance of official **Private Numbers (PN)** (e.g., `PN-884102-DLI`) for track possession and safe clearance.
- Real-time generation of **Form T/348M** (Written Authority to Occupy Track for Maintenance).

### 4. 📈 Real-Time Freight & Demand Forecasting
- Integrates seasonal demand patterns from **data.gov.in** and section occupancy from **COA / FOIS**.
- Models critical industrial commodity flows:
  - **BOXN Coal Rakes** for thermal power plants (critical stock monitoring).
  - **BTPN Petroleum Rakes** from Mathura / Barauni refineries.
  - **CONCOR Container Rakes** aligned with Western Dedicated Freight Corridor (W-DFC) vessel cut-offs.
- Shifts low-priority empty freight rakes around maintenance windows without causing network gridlock.

### 5. 📡 Resilient Field Dispatch Engine (2G & SMS Fallback)
- Operates reliably in remote track corridors lacking high-speed 4G/5G data:
  - **Tier 1:** Web & WhatsApp Interactive Rich Messages with action buttons.
  - **Tier 2:** Standard 160-character GSM SMS via telecom gateway (works on basic 2G feature phones).
  - **Tier 3:** Automated IVR voice call confirmation.
- **Two-Way SMS Command Parser**: Interprets syntax such as `BLOCK REQ | SEC:NDL-GZB | KM:127-128 | DUR:3HR`, executes validation against the backend, and replies with cryptographic confirmation and Private Numbers.

### 6. 🌦️ Weather & Monsoon Risk Adaptation Radar
- Real-time integration with **Indian Meteorological Department (IMD)** telemetry:
  - **River Bridge Scour Watch**: Tracks Yamuna & Ganga bridge water levels against danger marks.
  - **Vindhya/Western Ghats Cutting Sensors**: Evaluates soil moisture saturation to prevent boulder falls during heavy track tamping.
  - **Thermal Rail Stress Watch**: Monitors rail temperatures exceeding 55°C to avoid summer rail buckling and enforce Temporary Speed Restrictions (TSRs).

---

## 👥 Role-Based Portals & Demo Profiles

Sahayak Rail provides tailored workflows based on authentic Indian Railways operating roles:

| Department | Role | Officer Name | Key Function | Default Landing |
| :--- | :--- | :--- | :--- | :--- |
| **COA** | Section Controller / Orchestrator | Chief Controller A. K. Verma | Grant/modify blocks, manage corridor Gantt, issue Private Numbers | `/#coa-dashboard` |
| **P-Way** | Senior Section Engineer (Civil) | SSE R. K. Sharma | Track tamping, BCM, rail renewal, USFD flaw scan bids | `/#dept-dashboard` |
| **S&T** | Senior Section Engineer (Signal) | SSE M. Patel | Point machine rodding, track circuit renewals, interlocking | `/#dept-dashboard` |
| **TRD** | Senior Section Engineer (Electrical) | SSE K. Deshmukh | 25kV catenary wash, dropper tuning, power block isolation | `/#dept-dashboard` |

---

## 🖥️ Application Navigation & Pages

### COA Command Suite
- **`/#coa-dashboard`**: Live Section Controller command deck with 24-hour corridor Gantt timeline, punctuality gauges, active possessions, and emergency block injection simulator.
- **`/#coa-requests`**: Unified multi-department maintenance requests inbox with approval, modification, and rejection controls.
- **`/#coa-schedule`**: Multi-horizon schedule viewer (24-hour tactical, 7-day tactical, and 30-day strategic plans).

### Departmental Portal Suite
- **`/#dept-dashboard`**: Departmental equipment health, active block tracking, and corridor availability status.
- **`/#dept-requests`**: Work order bidding interface, bundling status tracker, and defect urgency viewer.
- **`/#dept-contact`**: Direct inter-departmental communication directory for P-Way, S&T, and TRD coordinators.
- **`/#dept-dispatch`**: Field dispatch and Private Number verification center.

### Specialized Operational & Solver Studios
- **`/#overview` / `/#landing`**: Public IRCTC-styled portal with interactive Leaflet GIS railway network map, corridor search, and system USPs.
- **`/#optimizer`**: CP-SAT solver playground with priority sliders (Punctuality vs Safety vs Track Utilization) and cross-department bid submission.
- **`/#freight`**: Real-time freight rake tracking (BOXN, BCNA, BTPN, CONCOR) and industrial supply-chain forecast.
- **`/#field-dispatch`**: Two-way 2G SMS terminal, GSM command simulation, and digital **Form T/348M** memo printer.
- **`/#weather`**: IMD monsoon radar, river bridge water level gauges, ghat slope stability alerts, and rail thermal stress monitor.
- **`/#audit`**: Immutable regulatory ledger, XAI SHAP factor breakdown, and Private Number audit trail.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 19, Vite 8, React DOM |
| **GIS & Mapping** | Leaflet 1.9.4, React-Leaflet 5.0 |
| **Styling & UI** | Vanilla CSS with custom design tokens adhering to official IRCTC & CRIS aesthetics |
| **Backend Framework** | FastAPI (Python 3.11+), Uvicorn ASGI Server |
| **Database & ORM** | SQLAlchemy 2.0, SQLite (local zero-config) / PostgreSQL (Supabase production ready) |
| **Validation & Serialization** | Pydantic v2, Python-Dotenv |
| **Optimization & Analytics** | Google OR-Tools CP-SAT Constraint Programming Solver |
| **Code Quality & Linter** | Oxlint |

---

## 📂 Project Directory Structure

```
Hackwave-3.0/
├── backend/
│   ├── main.py                     # FastAPI application entrypoint & CORS setup
│   ├── db.py                       # SQLAlchemy engine & session configuration
│   ├── models.py                   # ORM models (Corridors, Bids, Defects, Weather, Audit)
│   ├── schemas.py                  # Pydantic request/response validation schemas
│   ├── seed.py                     # Database initialization & mock data seeder
│   ├── requirements.txt            # Python dependencies (FastAPI, SQLAlchemy, Uvicorn, etc.)
│   ├── sahayak.db                  # Pre-seeded SQLite demonstration database
│   ├── .env.example                # Environment variables template
│   └── routers/                    # Modular REST API endpoints
│       ├── __init__.py
│       ├── auth.py                 # SSO authentication & session verification
│       ├── dashboard.py            # Corridor occupancy, tactical & strategic schedules
│       ├── optimizer.py            # Defect feeds, bid submission & solver execution
│       ├── dispatch.py             # 2G SMS processing, Private Numbers & Form T/348M
│       ├── freight.py              # Freight rakes telemetry & calm window forecast
│       ├── weather.py              # IMD river bridge gauges & ghat sensors
│       └── audit.py                # Regulatory audit ledger & XAI decisions
│
├── frontend/
│   ├── index.html                  # HTML entrypoint with Indian Railways typography
│   ├── package.json                # Frontend dependencies (React 19, Leaflet, Vite)
│   ├── vite.config.js              # Vite configuration
│   ├── public/                     # Favicons and SVG symbols
│   └── src/
│       ├── main.jsx                # React root mount
│       ├── App.jsx                 # Universal hash routing & auth state manager
│       ├── App.css                 # Base layout styling
│       ├── index.css               # Design system tokens (IRCTC navy, CRIS orange, rail green)
│       ├── assets/                 # High-resolution rolling stock & branding assets
│       ├── components/             # Reusable UI components
│       │   ├── Navbar.jsx / .css   # Official header with live Indian Railways time & user badge
│       │   ├── Hero.jsx / .css     # Corridor lookup & Vande Bharat hero banner
│       │   ├── IndiaMap.jsx / .css # Leaflet interactive GIS network map
│       │   ├── USPCards.jsx / .css # Six core innovation pillar cards
│       │   ├── LoginModal.jsx      # SSO authentication modal
│       │   ├── LoginSection.jsx    # Department portal quick-launcher
│       │   ├── Logos.jsx           # SVG vectors (Ashoka Emblem, IR Crest, CRIS)
│       │   └── Footer.jsx / .css   # Government compliance footer
│       └── pages/                  # Dedicated operational dashboards
│           ├── LandingPage.jsx     # Public overview portal
│           ├── LoginPage.jsx       # Multi-role authentication selector
│           ├── COADashboardPage.jsx# Section Controller live operations deck
│           ├── COARequestsPage.jsx # Multi-department request approvals
│           ├── COASchedulePage.jsx # Tactical & strategic timetable Gantt
│           ├── DeptDashboardPage.jsx # P-Way, S&T, TRD departmental dashboards
│           ├── DeptRequestsPage.jsx# Department bid submission
│           ├── DeptContactPage.jsx # Inter-department coordination
│           ├── DeptDispatchPage.jsx# Department field dispatch
│           ├── OptimizerPage.jsx   # AI CP-SAT solver studio
│           ├── FreightForecastPage.jsx # Goods rake & supply-chain radar
│           ├── FieldDispatchPage.jsx   # 2G SMS terminal & Form T/348M generator
│           ├── WeatherPage.jsx     # IMD monsoon & risk adaptation radar
│           └── AuditPage.jsx       # Regulatory compliance ledger & XAI
│
├── .gitignore                      # Clean Git ignore rules (no caches, pycache, or env)
├── .oxlintrc.json                  # Oxlint configuration
├── PROTOTYPE_REPORT.mdx            # In-depth architectural audit & roadmap
├── RailSahayak_Anshika_v3.1 final ashwin.pptx # Hackathon presentation deck
├── Hackwave_Complete_Project_Guide.pdf        # Complete technical project guide
└── README.md                       # Comprehensive project documentation
```

---

## 📡 REST API Reference

The backend exposes an interactive **Swagger UI** at `http://localhost:8000/docs`. Key endpoints include:

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Role-based SSO authentication verification |
| `GET` | `/api/dashboard/corridors` | Corridors list with real-time train and block occupancy |
| `GET` | `/api/dashboard/tactical` | 7-day tactical maintenance schedule |
| `GET` | `/api/dashboard/strategic`| 30-day strategic corridor maintenance outlook |
| `GET` | `/api/dashboard/status` | Solver engine KPIs (throughput, hours saved, conflicts) |
| `GET` | `/api/optimizer/defects` | Live track defect feed (TMS TGI flaws, SMMS point failures) |
| `GET` | `/api/optimizer/bids` | Cross-department maintenance block bids |
| `POST`| `/api/optimizer/solve` | Trigger CP-SAT constraint optimization run |
| `POST`| `/api/optimizer/bids` | Submit a new departmental possession bid |
| `GET` | `/api/dispatch/messages` | SMS dispatch log & two-way command history |
| `POST`| `/api/dispatch/sms` | Ingest and parse incoming two-way GSM SMS commands |
| `POST`| `/api/dispatch/issue-pn` | Issue official cryptographic Private Number (PN) |
| `GET` | `/api/dispatch/memo/{id}`| Generate official digital **Form T/348M** memo |
| `GET` | `/api/freight/rakes` | Telemetry of active freight rakes (BOXN, BCNA, CONCOR) |
| `GET` | `/api/freight/calm-windows` | Predictive low-traffic calm windows from data.gov.in |
| `GET` | `/api/weather/sections` | Real-time IMD weather alerts & sensor telemetry |
| `GET` | `/api/weather/state` | Section danger level and speed restriction advisories |
| `GET` | `/api/audit/decisions` | Explainable AI (XAI) decision factors and SHAP values |
| `GET` | `/api/audit/ledger` | Immutable regulatory compliance audit log |

---

## 🚀 Quickstart & Local Setup

### Prerequisites
- **Node.js** (v18.0.0 or higher) & **npm** (v9.0.0 or higher)
- **Python** (v3.10 or higher)
- **Git**

---

### Step 1: Clone the Repository
```bash
git clone https://github.com/Harshwardhans-hub/Hackwave-3.0.git
cd Hackwave-3.0
```

---

### Step 2: Setup and Start the Backend (FastAPI)

1. Open a terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   ```bash
   # On Windows PowerShell:
   python -m venv venv
   .\venv\Scripts\Activate.ps1

   # On Linux / macOS:
   python3 -m venv venv
   source venv/bin/activate
   ```

3. Install required Python packages:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure environment variables (optional, SQLite is used by default):
   ```bash
   # Copy the example environment file
   copy .env.example .env     # Windows
   # cp .env.example .env      # Linux/macOS
   ```

5. Seed the database with demonstration corridor data:
   ```bash
   python seed.py
   ```

6. Start the FastAPI development server:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   - **FastAPI API**: [http://localhost:8000](http://localhost:8000)
   - **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### Step 3: Setup and Start the Frontend (React + Vite)

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173/
   ```

---

## 🔒 Safety & Regulatory Compliance

Sahayak Rail is engineered in strict compliance with the statutory codes of Indian Railways:

1. **IRPWM (Indian Railways Permanent Way Manual)**:
   - **Para 808 Compliance**: Mandatory track tamping and stone blowing triggered when Track Geometry Index (TGI) drops below permissible limits.
   - Classification of rail defects (IMR, OBS, REM) with strict possession deadlines.
2. **ACTM (AC Traction Manual)**:
   - **Volume II Para 2063 Compliance**: Mandatory Permit-to-Work (PTW) protocols, 25kV catenary de-energization, section earthing, and power block clearance.
3. **IRSEM (Indian Railways Signal Engineering Manual)**:
   - Section 3 disconnection and reconnection protocols (Form S&T T/351) before point machine, track circuit, or axle counter maintenance.
4. **General & Subsidiary Rules (G&SR)**:
   - Strict adherence to absolute block working, Caution Orders (**Form T/409**), and track occupancy authorities (**Form T/348M**).

---

## 👥 Hackwave 3.0 Team
- **Project**: Sahayak Rail (सहायक रेल)
- **Domain**: Railway Infrastructure & Maintenance Block Scheduling
- **Target Organization**: Ministry of Railways (Government of India) / Railway Board / CRIS / RDSO
- **Repository**: [https://github.com/Harshwardhans-hub/Hackwave-3.0](https://github.com/Harshwardhans-hub/Hackwave-3.0)

---

## 📄 License
This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
