# Hospital Finder – Find the RIGHT Hospital at the RIGHT TIME 🏥

> **Core USP:** “Don’t just find the nearest hospital. Find the hospital that can help.”

**Hospital Finder** is a modern, AI-assisted healthcare routing platform built to help patients and caregivers find hospitals that best match their clinical requirements in real-time. Instead of simply sorting by proximity, Hospital Finder extracts medical requirements from natural language input and evaluates hospitals using a transparent, 6-factor weighted algorithm.

---

## 🌟 Key Features

1. **Natural Language AI Requirement Extraction**:
   - Accepts plain-English descriptions (e.g., *"I need a cardiologist urgently. My father has severe chest pain and we may need ICU support. Blood group is O+."*).
   - Converts natural text into structured clinical requirements: Treatment, Specialist, Emergency Level, ICU Requirement, Blood Group, and Medicines.
   - Operates with an AI LLM layer with a **100% reliable rule-based fallback parser** (no API key required).

2. **6-Factor Weighted Smart Matching Model**:
   - **Treatment Match (30%)**: Verifies hospital clinical department readiness.
   - **Specialist Availability (20%)**: Checks if required specialist (Cardiologist, Neurologist, etc.) is on duty.
   - **ICU & Emergency Capacity (15%)**: Evaluates free ICU beds and emergency bay status.
   - **Blood & Medicine Inventory (15%)**: Checks live stock for required blood groups (O+, A-, etc.) and critical pharmaceuticals.
   - **Travel Time (10%)**: Calculates estimated travel time considering urban traffic buffers.
   - **Proximity / Distance (10%)**: Haversine formula calculation from patient coordinates.

3. **Explainable AI Matching**:
   - Provides a **"Why this hospital?"** score breakdown and human-readable explanation for every recommendation.

4. **Emergency Mode**:
   - High-visibility, high-contrast 1-tap emergency interface for rapid routing during critical medical events.
   - Includes instant one-tap **Navigate to Best Hospital** via Google Maps directions and direct **Call ER Desk**.

5. **Blood Bank & Pharmacy Inventory Finder**:
   - Search real-time unit counts for blood groups (A+, A-, B+, B-, AB+, AB-, O+, O-).
   - Search hospital pharmacy inventories for emergency medicines (Insulin, Heparin, Remdesivir, etc.).

6. **Hospital Staff Management Dashboard**:
   - Live portal (`/hospital-dashboard`) allowing staff to update ICU bed counts, blood stock, specialist schedules, and emergency availability with immediate MongoDB persistence.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React.js (v18) + Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router (v6)
- **HTTP Client**: Axios
- **Icons**: Lucide React (`lucide-react`)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB + Mongoose (with automated In-Memory DB fallback if no local MongoDB instance is running)
- **Distance Math**: Haversine Formula Utility

---

## 📁 Repository Structure

```
hospital-finder/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Navbar, Footer, HospitalCard, ExplainableModal, DisclaimerBanner
│   │   ├── pages/              # HomePage, FindHospitalPage, HospitalDetailsPage, EmergencyModePage, BloodMedicinePage, HospitalDashboardPage
│   │   ├── utils/              # Axios API helper methods
│   │   ├── App.jsx             # Main Router setup
│   │   └── main.jsx            # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Express.js Backend
│   ├── src/
│   │   ├── models/             # Hospital, BloodInventory, Medicine Mongoose models
│   │   ├── routes/             # hospitalRoutes, aiRoutes, bloodRoutes, medicineRoutes
│   │   ├── utils/              # extractor, matchingEngine, haversine
│   │   ├── data/               # Seed data with 8 realistic hospitals
│   │   ├── db.js               # Dual MongoDB / In-Memory database manager
│   │   ├── seed.js             # Standalone DB seeder
│   │   └── index.js            # Express application entry
│   ├── package.json
│   └── .env
│
├── .env.example
├── package.json                # Monorepo runner scripts
└── README.md
```

---

## ⚙️ Environment Variables

Create `.env` in `server/` (or set system environment variables):

```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/hospital-finder
LLM_API_KEY=
MAPS_API_KEY=
```

> **Note:** The application runs out of the box without requiring external LLM or Maps API keys.

---

## 🚀 Quick Start & Installation

### Option 1: One-Command Start (Root Monorepo)

```bash
# 1. Clone repository
cd hospital-finder

# 2. Install dependencies for root, client, and server
npm run install:all

# 3. Start both backend and frontend concurrently
npm run dev
```

The application will be accessible at:
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:5001/api`

---

### Option 2: Running Backend & Frontend Separately

#### Start Backend:
```bash
cd server
npm install
npm start
```
*(Runs on `http://localhost:5001`)*

#### Start Frontend:
```bash
cd client
npm install
npm run dev
```
*(Runs on `http://localhost:3000`)*

---

## 🔌 API Endpoints Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/hospitals` | List all hospitals |
| `GET` | `/api/hospitals/:id` | Fetch detailed hospital profile |
| `POST` | `/api/extract-requirements` | Extract structured JSON from natural language text |
| `POST` | `/api/match-hospitals` | Calculate 6-factor match score & rank hospitals |
| `GET` | `/api/blood` | Search blood bank inventory by group & location |
| `GET` | `/api/medicines` | Search hospital pharmacy medicine stocks |
| `PUT` | `/api/hospitals/:id/availability` | Update hospital capacity, blood, & medicine inventory |

---

## 🧪 Acceptance Test Flow

To test the complete end-to-end journey:

1. Open `http://localhost:3000/find-hospital`.
2. Enter the test input:
   > *"I need a cardiologist urgently. My father has severe chest pain and we may need ICU support. Blood group is O+."*
3. Click **Find Suitable Hospitals**.
4. Observe **AI Requirement Understanding**:
   - Treatment → **Cardiology**
   - Specialist → **Cardiologist**
   - Emergency → **Urgent / Critical**
   - ICU → **Required**
   - Blood Group → **O+**
5. View ranked suitable hospitals with match score badges (e.g. 92% Match).
6. Click **"Why this hospital?"** to inspect the 6-factor score breakdown (Treatment 30/30, Specialist 20/20, Capacity 15/15, Inventory 15/15, Travel 8/10, Distance 7/10).
7. Click **View Details** to open the hospital profile.
8. Click **Navigate** to open Google Maps directions.

---

## 🛡️ Safety UX & Disclaimer

This tool provides hospital discovery and routing assistance only. It is not a diagnostic system and does not replace medical professionals. In a life-threatening emergency, contact local emergency services immediately (102 / 108 / 112).
