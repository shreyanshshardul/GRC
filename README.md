# GRC Risk Assessment Dashboard

A full-stack **Governance, Risk & Compliance (GRC) Risk Assessment Dashboard**
that helps identify, analyze, and visualize enterprise risks using a  
**Likelihood × Impact** based risk matrix.

This project demonstrates core GRC concepts such as **risk scoring**,
**risk categorization**, and **risk prioritization** using a heatmap.

---

## 🚀 Features

- Add risks with **asset**, **threat**, **likelihood**, and **impact**
- Automatic **risk score calculation**
- Risk classification into:
  - 🟢 **Low**
  - 🟡 **Medium**
  - 🟠 **High**
  - 🔴 **Critical**
- Interactive dashboard with:
  - Risk table
  - Filtering & sorting
  - **5×5 risk heatmap visualization**
- CSV export of risk data
- Clean and responsive UI

---

## 🧠 Risk Calculation Logic

**Risk Score = Likelihood × Impact**

| Score Range | Risk Level |
|------------|-----------|
| ≤ 5        | Low       |
| 6 – 12     | Medium    |
| 13 – 18    | High      |
| > 18       | Critical  |

This model follows standard GRC practices used in frameworks such as  
**ISO 27001** and **NIST SP 800-30**.

---

## 🛠️ Tech Stack

### Frontend
- React
- Axios
- Bootstrap

### Backend
- Node.js
- Express.js
- SQLite
- dotenv
- cors

---

## 🌐 Live Backend API

**Base URL:**  
https://grc-filter-task-shreyansh-shardul.onrender.com

### Available Endpoints
- **GET** `/api/v1/risks` → Fetch all risks
- **POST** `/api/v1/add-risk` → Add a new risk

---

## 📸 Screenshots

### 🔹 Risk Input Form
<img width="1483" height="565" alt="Risk Form" src="https://github.com/user-attachments/assets/aeb126ad-b044-4fe2-b107-007a0f9c2b06" />

### 🔹 Dashboard View
<img width="1740" height="842" alt="Dashboard" src="https://github.com/user-attachments/assets/ff1b0aa9-331b-4491-90e7-1b5bdf8ddacf" />

### 🔹 Risk Heatmap
<img width="1677" height="407" alt="Heatmap" src="https://github.com/user-attachments/assets/a2f3a5f9-0fa7-4257-a48c-2e8ec68efce2" />

---

## ▶️ Run the Project Locally

## Create a .env file inside the frontend folder:
REACT_APP_BACKEND=https://grc-filter-task-shreyansh-shardul.onrender.com

## Backend Setup
cd backend    

npm install
  
npm start  

Backend will start on port 8000.


### Frontend Setup

cd my-app  

npm install 

npm start

